const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
var query = require('./dbQuery');

const url = 'mongodb://localhost:27017';
const dbName = 'crime';

module.exports = {
    // User report crime record (Attack Image)
    report: async function (req, res, reportId) {
        await MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, async function (err, client) {
            if (err) {
                return console.error('Mongo Connection Error:' + err.message);
            }
            console.log("Connect successfully to Mongo server");

            const db = client.db(dbName);

            const bodyContent = req.body;
            if (bodyContent == null || bodyContent.time == null || bodyContent.latitude == null || bodyContent.longitude == null || bodyContent.type == null) {
                result = {
                    code: 400,
                    msg: 'Missing body content'
                };
                return res.json(result);
            }

            // console.log("Report ID is:" + insertId);
            if (reportId == null || reportId === 'undefined') {
                result = {
                    code: 400,
                    insertId: reportId,
                    msg: 'MongoDB Insert ReportId Error'
                };
                return res.json(result);
            }
            bodyContent.reportId = reportId;

            const imgCollection = db.collection('images');
            await query.insertImage(imgCollection, bodyContent.img, function (_id) {
                console.log("Insert into Image ok!");
            });

            const recordCollection = db.collection('userRecords');
            await query.insertUserRecordMongo(recordCollection, bodyContent, function (_id) {
                client.close();
                console.log("insertUserRecord", _id, "ok!!");
                result = {
                    code: 200,
                    msg: 'Report Succeed',
                    _id: _id
                };
                return res.send(result);
            });
        })
    },

    getImages: async function (req, res) {
        await MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, async function (err, client) {
            if (err) {
                return console.error('Mongo Connection Error:' + err.message);
            }
            console.log("Connected successfully to server");

            const db = client.db(dbName);
            const collection = db.collection('images');

            await query.findOne(collection, function (items) {
                // fs.writeFile('res.jpeg', items.img, 'base64', function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                //     console.log("Write File Succeed!");});
                // const result = items.map(item => item.img);
                client.close();
                res.contentType('image/jpeg');
                return res.send(items.img);
            });
        })
    },

    uploadImage: async function (req, res, img) {
        await MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, async function (err, client) {
            if (err) {
                return console.error('Mongo Connection Error:' + err.message);
            }
            console.log("Connected successfully to server");

            const db = client.db(dbName);
            const collection = db.collection('images');

            await query.insertImage(collection, img, function (_id) {
                client.close();
                return res.send(_id);
            })
        })
    },

     wardPredict: async function (req, res) {
        await MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.error('Mongo Connection Error:' + err.message);
            }

            const db = client.db(dbName);
            const collection = db.collection('events');

            const queryWard = req.query.ward;

            query.wardPredict(collection, function (result) {
                client.close();
                return res.send(result[queryWard - 1]); //_id: 1-indexed
            })
        })
    },
};