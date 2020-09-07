// This file will control the behavior of the sc radio player
const scdl = require('soundcloud-downloader');
const fs = require('fs');
const util = require('../util/logic');

// TODO refactor for Util
const logger = util.logger;


// TODO bring in processing logic here and pass output to views
const MAX_DURATION = 6 // in minutes
const MAX_PLAYS = 100000;
const NUM_REQUESTS = 10; // bulk handling

// function logger(msg) {
//     console.log(msg);
// }

function getId() {
    return Math.floor(Math.random() * 999999999) + 100000000;
}

function getClientID() {
    // TODO refresh by interval
}

function nextTrackURL(track_id) {
    let temp = "https://api-v2.soundcloud.com/tracks/";
    temp = temp.concat(track_id.toString());
    temp = temp.concat("?client_id=yBT1d8kK7at5QuM6ik9RFcvPvDTi4xyP");
    return temp;
}

// Return loaded XMLHTTP obj with next random track url
function prepareAPIRequest() {
    const api_url = nextTrackURL(getId());
    const options = {
        method: "GET",
        url: api_url,
    };
    var xhr = new XMLHttpRequest(); // builtin browser object to make requests
    xhr.open(options.method, cors_api_url + options.url); // specify the request
    return xhr;
}

// Checks if a given JSON track info obj is acceptable (not empty + selection)
function passCriteria(trackObj) {
    // if (scResponse) {
    //     // TODO parse trackObj + criteria check + sauce it to client
    //     const title = obj.title;
    //     const artist = obj.user.username;
    //     const duration = (Math.round(obj.duration / 1000 / 60));
    //     const plays = obj.playback_count;
    //     const permalink_url = obj.permalink_url;
    //     //const public_t = obj.public;
    //     trackObj.title = scResponse.title;
    //     trackObj.artist = scResponse.user.username;
    //     trackObj.url = scResponse.permalink_url;
    //     logger("SUCCESS");
    //     res.json(trackObj);
    // }
    return trackObj && // check non empty (dud)
        trackObj.public &&
        (Math.round(trackObj.duration / 1000 / 60) <= MAX_DURATION) &&
        (trackObj.plays <= MAX_PLAYS);
}

// Sends req for next random track JSON obj from SC api.
// Sets callbacks to fire for appropriate response.
// Returns undef on success.
function getNextTrack(updateDomCallback) {
    const xhr = prepareAPIRequest();

    // gets called as soon as the req completes successfully
    xhr.onload = () => {
        // the callback triggered on circumstance
        if (xhr.status === 404) {
            logger("404 error --- No track at that url");
            getNextTrack(updateDomCallback);
        } else if (xhr.status !== 200) {
            logger(xhr.status + " error --- " + xhr.responseText);
        } else {
            // Found track
            logger("FOUND");
            const obj = JSON.parse(xhr.responseText);
            logger(obj);
            const title = obj.title;
            const artist = obj.user.username;
            const duration = (Math.round(obj.duration / 1000 / 60));
            const plays = obj.playback_count;
            const permalink_url = obj.permalink_url;
            const public_t = obj.public;

            logger("Title: " + title);
            logger("Artist: " + artist);
            logger("Duration: " + duration);
            logger("Plays: " + plays);
            logger("URL: " + permalink_url);
            logger("Public: " + public_t);

            // check pass criteria else recurse
            if (passCriteria(duration, plays, public_t)) {
                logger("YES!");
                next(obj); // update state
                updateDomCallback(title, permalink_url, artist);
            } else {
                logger("NO!");
                getNextTrack(updateDomCallback);
            }
        }
    };

    // TODO handle XHR error edge case (rare)
    xhr.onerror = () => {
        logger("XHR failed --- This is very bad!!");
    };

    // This is by default async. returns (undef) as soon as req is sent
    xhr.send();
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

    // TODO add catch block at end of chain
    app.get('/next', async function (req, res) {
        //const test_url = "https://soundcloud.com/crayyan/jump";
        //scdl.download(test_url).then(stream => stream.pipe(fs.createWriteStream("audio.mp3")))
        // Number of bulk requests to make
        let pot_tracks = [].fill(null, 0, 9);
        pot_tracks.map(() => getId());
        logger("ARRAY:");
        pot_tracks.forEach(e => logger(e));
        //for (let j = 0; j < NUM_REQUESTS; ++ j) { pot_tracks.push(getId()); }
        //let track_id = [getId()];

        scdl.getTrackInfoByID(pot_tracks)
            .then(result => {
                // TODO bulk requests
                const trackObjs = result.filter((trackObj) => passCriteria(trackObj));
                res.json({tracks: trackObjs});
                logger("SUCCESS");
                //const scResponse = result[0];
                // if (scResponse) {
                //     // TODO parse trackObj + criteria check + sauce it to client
                //     let trackObj = {};
                //     trackObj.title = scResponse.title;
                //     trackObj.artist = scResponse.user.username;
                //     trackObj.url = scResponse.permalink_url;
                //     logger("SUCCESS");
                //     res.json(trackObj);
                // } else {
                //     // TODO recurse
                //     res.json({dud: ""});
                // }
            })
            .catch(result => logger(result));
    });

};