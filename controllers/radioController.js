// This file will control the behavior of the sc radio player
const scdl = require('soundcloud-downloader');
const fs = require('fs');

// This is for exporting components that can be used by node in app.js.
// Passing in the express var
module.exports = function(app){

    app.get('/', function(req, res) {
        res.render('page'); // view name. auto searches in views folder which has been mapped to public
    });

    // TODO add handler for when client requests next track

};