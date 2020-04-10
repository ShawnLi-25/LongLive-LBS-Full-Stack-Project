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
  console.log(req.body);
  accessDB.reportUserRecord(req, res, next);
});

router.put('/report', function(req, res, next) {
  accessDB.updateUserRecord(req, res, next);
});

router.delete('/report/:id', function(req, res, next) {
  accessDB.deleteUserRecord(req, res, next);
});

/* Get Nearby locations for Heatmap */
router.get('/getNearbyLocs', function(req, res, next) {
  accessDB.getNearbyLocs(req, res, next);
});

/* Get Nearby Events for heatmap */
router.get('/getNearbyEvents/', function(req, res, next) {
  console.log("getNearbyEvents root!");
  const result = {
    code: 200,
    msg: 'getNearbyEvents endpoint is alive!'
  };
  res.status(200).json(result)
});

/* Get Nearby Events for heatmap */
router.get('/getNearbyEvents/heatmap', function(req, res, next) {
  accessDB.getNearbyEvents(req, res, next, "heatmap");
});

/* Get # of Events group by Type */
router.get('/getNearbyEvents/type', function(req, res, next) {
  accessDB.getNearbyEvents(req, res, next, "type");
});

/* Get Nearby Events for specific type */
router.get('/getNearbyEvents/showType', function(req, res, next) {
  accessDB.getNearbyEvents(req, res, next, "showType");
});

/* Get Nearby Eevnts from official data */
router.get('/getNearbyEvents/src', function(req, res, next) {
  accessDB.getNearbySrcEvents(req, res, next);
});

/* Create Database */
router.post('/createDB', function(req, res, next) {
  accessDB.create(req, res, next);
});

/* Load SrcFile to Database */
router.post('/loadDB', function(req, res, next) {
  accessDB.load(req, res, next);
});

/* Forbidden */
router.get('/report', function(req, res, next) {
  accessDB.reportUserRecord(req, res, next);
});

router.post('/getNearbyLocs', function(req, res, next) {
  accessDB.getNearbyLocs(req, res, next);
});

router.post('/getNearbyEvents', function(req, res, next) {
  accessDB.getNearbyEvents(req, res, next, "");
});

module.exports = app;
