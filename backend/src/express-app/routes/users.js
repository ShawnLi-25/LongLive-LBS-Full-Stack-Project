var express = require('express');
var router = express.Router();

var accessDB = require('../database/db');

//Proide Endpoint here!

/* Sanity Test. */
router.get('/', function(req, res, next) {
  res.send('Here is users root');
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

module.exports = router;
