const MongoClient = require('mongodb').MongoClient;
var query = require('./dbQuery');

const url = 'mongodb://localhost:27017';
const dbName = 'crime';

module.exports = {
    // User report crime record (Attack Image)
    report: async function (req, res, reportId) {
        await MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.error('Mongo Connection Error:' + err.message);
            }
            console.log("Connect successfully to Mongo server");

            const db = client.db(dbName);
            const collection = db.collection('userRecords');

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
            query.insertOne(collection, bodyContent, function (_id) {
                client.close();
                result = {
                    code: 200,
                    msg: 'Report Succeed',
                    _id: _id
                };
                return res.send(result);
            });
        })
    },

    // Todo: test async
    findAll: async function (req, res) {
        await MongoClient.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.error('Mongo Connection Error:' + err.message);
            }
            console.log("Connected successfully to server");

            const db = client.db(dbName);
            const collection = db.collection('events');

            query.findAll(collection, function (items) {
                client.close();
                return res.send(items);
            });
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