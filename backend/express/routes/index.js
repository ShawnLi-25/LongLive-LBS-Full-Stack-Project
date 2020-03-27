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
router.get('/insertDB', function(req, res, next) {
  accessDB.insert(req, res, next);
});

/* Query Database */
router.get('/queryDB', function(req, res, next) {
  accessDB.query(req, res, next);
});

/* Create Database */
router.get('/createDB', function(req, res, next) {
  accessDB.create(req, res, next);
});

/* Load SrcFile to Database */
router.get('/loadDB', function(req, res, next) {
  accessDB.load(req, res, next);
});

router.get('/test', function(req, res, next) {
  console.log("SessionID is" + req.sessionID);
  accessDB.query(req, res, next);
});

module.exports = app;
