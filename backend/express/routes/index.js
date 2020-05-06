const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('../database/mysql');
const mongo = require('../database/mongo');
const helper = require('../helper');
const multer = require('multer');
const cacheDir = './images/';
var upload = multer({dest: cacheDir}); //Local image cache

var app = express();

var router = express.Router();
app.use(router);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Provide Endpoint here!

/* Main page */
router.get('/', function (req, res, next) {
    console.log("SessionID is" + req.sessionID);
    res.render('index', {title: 'LongLive', content: "Our Home page of CS411 Database Project!"});
});

/****** REST API ******/

/* Insert/Update/Delete Record in Database */
router.post('/report', upload.none(), function (req, res) {
    mysql.reportUserRecord(req, res);
});

router.post('/report/upload', upload.single('img'), function (req, res) {
    console.log(req.body)
    var imgData = fs.readFileSync(req.file.path, 'base64');
    fs.rename(req.file.path, req.file.path +'.jpg', function(err) {
        if (err) {
            return console.log("fs.rename error" + err);
        }
    });

    req.body.img = imgData;
    req.body.imgPath = req.file.path +'.jpg';
    mysql.reportUserRecord(req, res);
});

router.put('/report', function (req, res) {
    mysql.updateUserRecord(req, res);
});

router.delete('/report/:id', function (req, res) {
    mysql.deleteUserRecord(req, res);
});

router.get('/test', function (req, res) {
    const rand_coords = helper.getRandomLoc();
    res.send(rand_coords);
});

router.get('/image', function (req, res) {
    const urls = helper.getImageUrls();
    res.send(urls);
});

/* Get Nearby locations for Heatmap */
router.get('/getNearbyLocs', function (req, res) {
    mysql.getNearbyLocs(req, res, next);
});

/* Get Nearby Events for heatmap */
router.get('/getNearbyEvents/', function (req, res) {
    console.log("getNearbyEvents root!");
    const result = {
        code: 200,
        msg: 'getNearbyEvents endpoint is alive!'
    };
    res.status(200).json(result)
});

/* Get Nearby Events for heatmap */
router.get('/getNearbyEvents/heatmap', function (req, res) {
    mysql.getNearbyEvents(req, res, "heatmap");
});

/* Get # of Events group by Type */
router.get('/getNearbyEvents/type', function (req, res) {
    mysql.getNearbyEvents(req, res, "type");
});

/* Get Nearby Events for specific type */
router.get('/getNearbyEvents/showType', function (req, res) {
    mysql.getNearbyEvents(req, res, "showType");
});

router.get('/getNearbyEvents/beat', function (req, res) {
    mysql.getNearbyEvents(req, res, "beat");
});

/* Predict most frequent crime type applying data clustering */
router.get('/predict', function (req, res) {
    mysql.crimePredict(req, res);
});

// router.get('/predict/ward', function (req, res) {
//     mongo.wardPredict(req, res);
// });

/* Get Nearby Eevnts from official data */
router.get('/getNearbyEvents/src', function (req, res) {
    mysql.getNearbySrcEvents(req, res);
});

/* Create Database */
router.post('/createDB', function (req, res) {
    mysql.create(req, res);
});

/* Load SrcFile to Database */
router.post('/loadDB', function (req, res) {
    mysql.load(req, res);
});

/* Forbidden */
router.get('/report', function (req, res) {
    mysql.reportUserRecord(req, res, next);
});

router.post('/getNearbyLocs', function (req, res) {
    mysql.getNearbyLocs(req, res);
});

router.post('/getNearbyEvents', function (req, res) {
    mysql.getNearbyEvents(req, res, "");
});

module.exports = app;
