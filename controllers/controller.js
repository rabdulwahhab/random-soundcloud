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
    res.render('page', {track: trackObj});
    // view name. auto searches in views folder which has been mapped to public
  });

  app.get('/play', function (req, res) {
    logger(req.query.url);
    const test_url = "https://soundcloud.com/crayyan/jump";
    let readableStream;

    //scdl.download(test_url).then(stream =>
    // stream.pipe(fs.createWriteStream("audio.mp3")));
    res.writeHead(200, {'Content-Type': 'audio/mpeg'});
    //logger(req);
    logger(__dirname);
    // const src = fs.createReadStream('audio.mp3');
    // src.pipe(res);

    scdl.download(req.query.url)
        .then(stream => {
          readableStream = stream;
          // readableStream.on('end', () => {
          //   res.end('Goodbye\n');
          // });
          readableStream.pipe(res);
        })
        .catch(err => {
          readableStream.destroy();
          logger(err)
        });

    // scdl.getInfo(req.query.url)
    //     .then(result => res.json({info: result}))
    //     .catch(result => logger(result));
    // scdl.download(req.query.url)
    //     .then(stream => {
    //       const reader = stream.getReader();
    //       return new ReadableStream({
    //         start(controller) {
    //           return pump();
    //           function pump() {
    //             return reader.read().then(({ done, value }) => {
    //               // When no more data needs to be consumed, close the stream
    //               if (done) {
    //                 controller.close();
    //                 return;
    //               }
    //               // Enqueue the next data chunk into our target stream
    //               controller.enqueue(value);
    //               return pump();
    //             });
    //           }
    //         }
    //       })
    //     })
    //     .then(stream => new Response(stream))
    //     .then(response => response.blob())
    //     .then(blob => URL.createObjectURL(blob))
    //     .then(url => res.json({stream: url}))
    //     .catch(err => logger(err));
  });

  app.get('/next', async function (req, res) {
    //const test_url = "https://soundcloud.com/crayyan/jump";
    //scdl.download(test_url).then(stream => stream.pipe(fs.createWriteStream("audio.mp3")))
    // Number of bulk requests to make
    const NUM_REQUESTS = req.query.numRequests;
    let pot_tracks = [];
    for (let j = 0; j < NUM_REQUESTS; ++j) {
      pot_tracks.push(getId());
    }
    //pot_tracks[0] = 123456789; // TODO remove this
    //pot_tracks.map(() => getId());
    logger("ARRAY:");
    //pot_tracks.forEach(e => logger(e));

    // TODO MAJOR ::::: handle all duds case
    scdl.getTrackInfoByID(pot_tracks)
        .then(result => {
          //logger("RESULT FROM PROMISE ----");
          //logger(result);
          let trackObjs = result.filter(passCriteria);
          trackObjs = trackObjs.map((obj) => {
            // TODO ReadableStream?
            return {
              title: obj.title,
              artist: obj.user.username,
              url: obj.permalink_url,
              howl: null
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