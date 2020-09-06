// import express web framework
var express = require('express');
var app = express();
var radioController = require('./controllers/radioController'); // store function from module


// setup ejs template engine
app.set('view engine', 'ejs');

// static files
app.use(express.static('./public'));

// fire controllers
radioController(app);

// listen to port
app.listen(8000);
console.log("Live on port 8000");