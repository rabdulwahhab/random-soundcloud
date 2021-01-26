// import express web framework
var express = require('express');
var app = express();
var compression = require('compression');
var controller = require('./controllers/controller'); // store function from module


// setup ejs template engine
app.set('view engine', 'ejs');

// static + middleware
app.use(express.static(__dirname + '/public'));
app.use(compression()); // compress data on all routes

// fire controllers
controller(app);

// listen to port
var port = 3000;
app.listen(port);
console.log(`Live on port ${port}`);
