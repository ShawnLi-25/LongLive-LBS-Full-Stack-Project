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

/****** REST API ******/

/* Insert Record to Database */
router.post('/report', function(req, res, next) {
  accessDB.report(req, res, next);
});

/* Get Nearby locations for Heatmap */
router.get('/getNearbyLocs', function(req, res, next) {
  accessDB.getNearbyLocs(req, res, next);
});

/* Get Nearby Eevnts */
router.get('/getNearbyEvents', function(req, res, next) {
  accessDB.getNearbyEvents(req, res, next);
});

/* Get Nearby Eevnts from official data */
router.get('/getNearbyEvents/src', function(req, res, next) {
  accessDB.getNearbySrcEvents(req, res, next);
});

/* Get # of Events group by Type */
router.get('/getNearbyEvents/type', function(req, res, next) {
  accessDB.getEventNumByType(req, res, next);
});

/* Create Database */
router.get('/createDB', function(req, res, next) {
  accessDB.create(req, res, next);
});

/* Load SrcFile to Database */
router.get('/loadDB', function(req, res, next) {
  accessDB.load(req, res, next);
});


/* Forbidden */
router.get('/report', function(req, res, next) {
  accessDB.report(req, res, next);
});

router.post('/getNearbyLocs', function(req, res, next) {
  accessDB.getNearbyLocs(req, res, next);
});

router.post('/getNearbyEvents', function(req, res, next) {
  accessDB.getNearbyEvents(req, res, next);
});

module.exports = app;
