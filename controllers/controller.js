// This file will control the behavior of the sc radio player
const scdl = require('soundcloud-downloader');
const fs = require('fs');

// TODO bring in processing logic here and pass output to views
const MAX_DURATION = 6 // in minutes
MAX_PLAYS = 100000;

function logger(msg) {
    console.log(msg);
}

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

// This is for exporting components that can be used by node in app.js.
// Passing in the express var
module.exports = function (app) {

    // ROUTES
    app.get('/', function (req, res) {
        const trackObj = {title: "Random Soundcloud Tracks", artist: "", url: ""};
        res.render('page', {track: trackObj});
        // view name. auto searches in views folder which has been mapped to public
    });

    // TODO add handler for when client requests next track
    app.get('/next', function (req, res) {
       res.json({dummy: "dummy123"});
    });

};