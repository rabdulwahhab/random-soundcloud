// import express web framework
var express = require('express');
var app = express();
var controller = require('./controllers/controller'); // store function from module


// setup ejs template engine
app.set('view engine', 'ejs');

// static files
app.use(express.static(__dirname + '/public'));

// fire controllers
controller(app);

// listen to port
app.listen(8000);
console.log("Live on port 8000");