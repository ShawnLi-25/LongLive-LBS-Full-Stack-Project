var express = require('express');
var accessDB = require('../database/mysql');

var app = express();
var router = express.Router();

app.use(router);

//Provide Endpoint here!

/* Main page */
router.get('/', function(req, res, next) {
  console.log("SessionID is" + req.sessionID);
  res.render('index', { title: 'LongLive' , content: "Our Home page of CS411 Database Project!"});
});

/* Insert Record to Database */
router.get('/report', function(req, res, next) {
  accessDB.insert(req, res, next);
});

/* Get Nearby data for Heatmap */
router.get('/getNearbyLocs', function(req, res, next) {
  accessDB.getNearbyLocs(req, res, next => {
    console.log(res);
    if(res)
      return res;
  }) (req, res, next);
});

/* Query Database */
router.get('/getNearbyEvents', function(req, res, next) {
  accessDB.getNearbyEvents(req, res, next => {
    console.log(res);
    if(res)
      return res;
  });
});

/* Create Database */
router.get('/createDB', function(req, res, next) {
  accessDB.create(req, res, next);
});

/* Load SrcFile to Database */
router.get('/loadDB', function(req, res, next) {
  accessDB.load(req, res, next);
});

module.exports = app;
