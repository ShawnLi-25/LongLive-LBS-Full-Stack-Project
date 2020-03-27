var express = require('express');
const { v4: uuidv4 } = require('uuid');

var accessDB = require('../database/mysql');
var app = express();
var router = express.Router();

app.use(router);

//Provide Endpoint here!

/* Sanity Check. */
router.get('/', function(req, res) {
  console.log(req.sessionID);
  res.send('Welcome to the home page of CS411 LongLive!');
});

/* Create Database */
router.get('/insertDB', function(req, res, next) {
  accessDB.insert(req, res, next);
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
