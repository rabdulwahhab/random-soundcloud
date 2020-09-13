// This file will control the behavior of the sc radio player
const scdl = require('soundcloud-downloader');
const fs = require('fs');
const util = require('../util/logic');

// TODO refactor for Util
const logger = util.logger;

// Globals
const MAX_DURATION = 7; // in minutes
const MAX_PLAYS = 200000;

// function logger(msg) {
//     console.log(msg);
// }

// TODO Refine range???
function getId() {
  return Math.random().toFixed(9).split('.')[1];
}

// Checks if a given JSON track info obj is acceptable (not empty + selection)
function passCriteria(trackObj) {
  //logger("POLICY IS: ");
  const policy = trackObj.policy;
  //logger(policy);
  // If legal issues, only allow policy "ALLOW"
  return trackObj && trackObj.public &&
      (policy.localeCompare("SNIP") !== 0) &&
      (Math.round(trackObj.duration / 1000 / 60) <= MAX_DURATION) &&
      (trackObj.playback_count <= MAX_PLAYS);
}

// This is for exporting components that can be used by node in app.js.
// Passing in the express var
module.exports = function (app) {

  // ROUTES
  app.get('/', function (req, res) {
    const trackObj = {title: "Random Soundcloud Tracks", artist: "", url: ""};
    res.render('page');
    //res.render('page', {track: trackObj}); how to pass data
    // view name. auto searches in views folder which has been mapped to public
  });

  app.get('/play', function (req, res) {
    logger(req.query.url);
    res.writeHead(200, {'Content-Type': 'audio/mpeg'});
    scdl.downloadFormat(req.query.url, 'audio/mpeg')
        .then(stream => {
          stream.pipe(res);
        })
        .catch(err => {
          //readableStream.destroy();
          logger(err)
        });
  });

  app.get('/next', async function (req, res) {
    //const test_url = "https://soundcloud.com/crayyan/jump";
    //scdl.download(test_url).then(stream => stream.pipe(fs.createWriteStream("audio.mp3")))
    // Number of bulk requests to make
    const NUM_REQUESTS = req.query.numRequests;
    const color_code = "#ff5500";
    logger("NUM_REQ: " + NUM_REQUESTS);
    let pot_tracks = [];
    for (let j = 0; j < NUM_REQUESTS; ++j) {
      pot_tracks.push(getId());
    }

    // TODO MAJOR ::::: handle all duds case
    scdl.getTrackInfoByID(pot_tracks)
        .then(result => {
          let trackObjs = result.filter(passCriteria);
          trackObjs = trackObjs.map((obj) => {
            let stream = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/";
            stream = stream.concat(obj.id);
            stream = stream.concat("&color=");
            stream = stream.concat(encodeURIComponent(color_code));
            stream = stream.concat("&auto_play=true&hide_related=true&show_comments=true&show_user=true &show_reposts=false&show_teaser=false&visual=true");
            return {
              title: obj.title,
              artist: obj.user.username,
              artist_url: obj.user.permalink_url,
              track_url: obj.permalink_url,
              stream: stream
              // req.headers.referer.concat("play?url=").concat(obj.permalink_url)
            };
          })
          logger("TRACK OBJS ------");
          logger(trackObjs);
          res.json({tracks: trackObjs});
          logger("SUCCESS");
        })
        .catch(result => logger(result));
  });

};