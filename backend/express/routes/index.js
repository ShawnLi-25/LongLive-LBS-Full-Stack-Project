const express = require('express');
const formidableMiddleware = require('express-formidable');
const AsyncRouter = require("express-async-router").AsyncRouter;
const mysql = require('../database/mysql');
const mongo = require('../database/mongo');

var app = express();
app.use(formidableMiddleware());

var router = express.Router();
var asyncRouter = AsyncRouter();

app.use(router);

//Provide Endpoint here!

/* Main page */
router.get('/', function(req, res, next) {
  console.log("SessionID is" + req.sessionID);
  res.render('index', { title: 'LongLive' , content: "Our Home page of CS411 Database Project!"});
});

/****** REST API ******/

/* Predict most frequent crime type based on ward */
router.get('/predict/ward', function(req, res) {
  mongo.wardPredict(req, res);
});

router.post('/test', function(req, res, next) {
  req.body = req.fields;
  req.body.img = req.files.img;
  mysql.reportUserRecord(req, res, next);
});

router.get('/test', function(req, res) {
  mongo.findAll(req, res);
});

/* Insert/Update/Delete Record in Database */
router.post('/report', function(req, res, next) {
  console.log(req.body);
  mysql.reportUserRecord(req, res, next);
});

router.put('/report', function(req, res, next) {
  mysql.updateUserRecord(req, res, next);
});

router.delete('/report/:id', function(req, res, next) {
  mysql.deleteUserRecord(req, res, next);
});

/* Get Nearby locations for Heatmap */
router.get('/getNearbyLocs', function(req, res, next) {
  mysql.getNearbyLocs(req, res, next);
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
  mysql.getNearbyEvents(req, res, next, "heatmap");
});

/* Get # of Events group by Type */
router.get('/getNearbyEvents/type', function(req, res, next) {
  mysql.getNearbyEvents(req, res, next, "type");
});

/* Get Nearby Events for specific type */
router.get('/getNearbyEvents/showType', function(req, res, next) {
  mysql.getNearbyEvents(req, res, next, "showType");
});

/* Get Nearby Eevnts from official data */
router.get('/getNearbyEvents/src', function(req, res, next) {
  mysql.getNearbySrcEvents(req, res, next);
});

/* Create Database */
router.post('/createDB', function(req, res, next) {
  mysql.create(req, res, next);
});

/* Load SrcFile to Database */
router.post('/loadDB', function(req, res, next) {
  mysql.load(req, res, next);
});

/* Forbidden */
router.get('/report', function(req, res, next) {
  mysql.reportUserRecord(req, res, next);
});

router.post('/getNearbyLocs', function(req, res, next) {
  mysql.getNearbyLocs(req, res, next);
});

router.post('/getNearbyEvents', function(req, res, next) {
  mysql.getNearbyEvents(req, res, next, "");
});

module.exports = app;
