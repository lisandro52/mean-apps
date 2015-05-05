/// <reference path="../typings/node/node.d.ts"/>

// CALL THE PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');


// APP CONFIGURATION
//use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configura our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

//conenct to our database
mongoose.connect(config.database);

//log all requests to the console
app.use(morgan('dev'));


// REGISTER OUR ROUTES
//all of our routes will be prefixed with /api
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

apiRoutes.get('/me', function(req, res) {
    res.send(req.decoded);
});

// Main catch-all route
// Send users to frontend
// has to be registered after API ROUTES
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//==========================================================================================

// START THE SERVER
app.listen(config.port);
console.log('Magic happens on port ' + config.port);