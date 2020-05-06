var mysql = require('mysql');
var $conf = require('../config/mysqlConn');
var query = require('./dbQuery');
var conf = require('../config/config');
var helper = require('../helper');
const mongo = require('./mongo');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: $conf.mysql.host,
    user: $conf.mysql.user,
    password: $conf.mysql.password,
    database: $conf.mysql.database,
    port: $conf.mysql.port
});

module.exports = {
    // Deal with POST & GET Request

    // User report crime record (Foreign key constraint of events, times & locations)
    // body-content: {"time": "xxx", "latitude": "xxx", "longitude": "xxx", "type": "xxx", "description": "xxx", "email": "xxx"}
    // endpoint: /report
    reportUserRecord: function (req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method === "GET") {
                result = {
                    code: 400,
                    msg: 'Bad Request!'
                };
                return res.status(400).json(result);
            }

            const bodyContent = req.body;
            if (bodyContent == null || bodyContent.time == null || bodyContent.latitude == null || bodyContent.longitude == null || bodyContent.type == null) {
                result = {
                    code: 400,
                    msg: 'Missing body content'
                };
                return res.json(result);
            }

            // Foreigh key constriant with times & locations table
            // To keep data format clean
            let timeParams = helper.getTimeFields();
            let locKey = helper.getLocKey(bodyContent.latitude, bodyContent.longitude);

            var insertTime =
                new Promise((resolve, reject) => {
                    connection.query(query.insertTime, timeParams, function (err, timeRes) {
                        if (err) {
                            reject(err);
                            console.error('SQL Execution Error:' + err.message);
                        }
                        if (timeRes) {
                            console.log("Insert into times ok");
                            resolve(timeRes);
                        }
                    })
                });

            var insertLoc = insertTime.then(function (timeRes) {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertLoc,
                        [locKey, bodyContent.latitude, bodyContent.longitude, bodyContent.block,
                            bodyContent.beat, bodyContent.district, bodyContent.ward, bodyContent.communityArea], function (err, locRes) {
                            if (err) {
                                reject(err);
                                return console.error('SQL Execution Error:' + err.message);
                            }
                            if (locRes) {
                                console.log("Insert into locations ok!");
                                resolve(locRes);
                            }
                        })
                });
            });

            var insertEvent = insertLoc.then(function (locRes) {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertUserRecord,
                        [timeParams[0], locKey, bodyContent.type, bodyContent.description, bodyContent.email], function (err, eventRes) {
                            if (err) {
                                reject(err);
                                console.error('SQL Execution Error:' + err.message);
                            }
                            if (eventRes) {
                                console.log("Insert into Events Done!");
                                result = {
                                    code: 200,
                                    msg: 'MySQL Insert Succeed',
                                    reportID: eventRes.insertId
                                };
                            }
                            /* send back to client */
                            // res.send(result);
                            connection.release();
                            resolve(eventRes);
                        })
                });
            });

            // MongoDB insert call --- Get insertId from insertEvent as reference
            return Promise.all([insertTime, insertLoc, insertEvent]).then(function ([timeRes, locRes, eventRes]) {
                mongo.report(req, res, eventRes.insertId);
            })
                .catch((err) => {
                    return console.error('reportUserRecord Promise Chain Execution Error:' + err.message);
                });
        });
    },

    // Update user report crime record
    // body-content: {"reportID": "xxx", "type": "xxx"}
    // endpoint: /report
    updateUserRecord: function (req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method !== "PUT") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send PUT!'
                };
                return res.status(400).json(result);
            }

            const bodyContent = req.body;
            const reportID = Number(bodyContent.reportID);
            if (reportID == null) {
                result = {
                    code: 400,
                    msg: 'Missing body content'
                };
                return res.json(result);
            }

            connection.query(query.getUserRecord, [reportID], function (err, row) {
                if (err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                if (row.length === 0) {
                    result = {
                        code: 404,
                        msg: "Record not found!"
                    }
                }

                let type = bodyContent.type == null ? row.Type : bodyContent.type;
                let description = bodyContent.description == null ? row.Description : bodyContent.description;

                var updateRes =
                    new Promise((resolve, reject) => {
                        connection.query(query.updateUserRecord, [type, description, reportID], function (err, updateRes) {
                            if (err) {
                                reject(err);
                                console.error('SQL Execution Error:' + err.message);
                            }
                            if (updateRes) {
                                console.log("Update userRecord from MySQL ok");
                                connection.release();
                                resolve(updateRes);
                            }
                        });
                    });

                let params = {'type': type, 'description': description};
                return Promise.all([updateRes]).then(function () {
                    mongo.updateReport(req, res, reportID, params);
                })
                    .catch((err) => {
                        return console.error('reportUserRecord Promise Chain Execution Error:' + err.message);
                    });
            });

        })
    },

    // Delete user report crime record
    // endpoint: /report/reportID
    deleteUserRecord: function (req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method !== "DELETE") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send DELETE!'
                };
                return res.status(400).json(result);
            }

            const reportID = req.params.id;
            if (reportID == null) {
                result = {
                    code: 400,
                    msg: 'Missing reportID'
                };
                return res.json(result);
            }

            var deleteRes =
                new Promise((resolve, reject) => {
                    connection.query(query.deleteUserRecord, [reportID], function (err, delRes) {
                        if (err) {
                            reject(err);
                            console.error('SQL Execution Error:' + err.message);
                        }
                        if (delRes) {
                            console.log("Delete userRecord from MySQL ok");
                            connection.release();
                            resolve(delRes);
                        }
                    })
                });

            // MongoDB delete call
            return Promise.all([deleteRes]).then(function () {
                mongo.deleteReport(req, res, reportID);
            })
                .catch((err) => {
                    return console.error('reportUserRecord Promise Chain Execution Error:' + err.message);
                });

        })
    },

    // Get nearby locations based on square-distance for HeatMap
    // endpoint: /getNearbyLocs?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx
    getNearbyLocs: function (req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }

            const param = req.query;
            if (param.longitude == null || param.latitude == null || param.latDelta == null || param.lngDelta == null) {
                result = {
                    code: 400,
                    msg: 'Bad Request! Missing parameters'
                };
                return res.status(400).json(result);
            }

            var radius = Math.max(param.lngDelta, param.latDelta);

            connection.query(query.getNearbyLocs, [param.latitude, param.latDelta, param.longitude, param.lngDelta, conf.HEATMAPLIMIT], function (err, rows) {
                if (err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                var objs = [];

                if (rows) {
                    console.log(rows);
                    for (let i = 0; i < rows.length; i++) {
                        objs.push(rows[i]);
                    }
                    result = {
                        code: 200,
                        msg: 'Get Nearyby Locations Succeed!'
                    };
                }

                /* send back to client */
                res.send(JSON.stringify(objs));
                connection.release();
            });
        });
    },

    // Get nearby events based on location & time
    getNearbyEvents: function (req, res, event) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }

            const param = req.query;
            if (param.longitude == null || param.latitude == null || param.latDelta == null || param.lngDelta == null
                || param.longitude === 'undefined' || param.latitude === 'undefined'
                || event == null || event === ""
                || event === 'showType' && param.type == null) {
                result = {
                    code: 400,
                    msg: 'Bad Request! Missing parameters or undefined'
                };
                return res.status(400).json(result);
            }

            // Generate parameters for query
            const latLimit = param.latDelta / 2, lngLimit = param.lngDelta / 2;

            const year = (param.year != null && param.year !== 'undefined') ? param.year : new Date().getFullYear();
            const month = (param.month != null && param.month !== 'undefined') ? param.month : 3;
            const type = (param.type != null && param.type !== 'undefined') ? param.type.toUpperCase() : "HOMICIDE";

            connection.query(query.getNearbyLocs, [param.latitude, latLimit, param.longitude, lngLimit, conf.HEATMAPLIMIT], function (err, rows) {
                if (err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                // Deal with location miss data
                let locList = rows.filter(function (row) {
                    return row.Location != null && row.Location !== "";
                }).map(i => i.Location);

                if (locList === 'undefined' || locList.length === 0) {
                    const objs = [];
                    connection.release();
                    return res.send(JSON.stringify(objs));
                }

                if (event === 'heatmap') {
                    // Get nearby events location for heatmap
                    // endpoint: /getNearbyEvents/heatmap?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx&year=xxx&month=xxx
                    connection.query(query.getHeatmapEvents, [locList, year, month, locList, year, month, conf.HEATMAPLIMIT], function (err, rows) {
                        if (err) {
                            return console.error('SQL Execution Error:' + err.message);
                        }

                        var points = [];

                        if (rows) {
                            // console.log(rows);
                            for (let i = 0; i < rows.length; i++) {
                                points.push(rows[i]);
                            }
                        }
                        res.send(JSON.stringify(points));
                        connection.release();
                    });

                } else if (event === 'type') {
                    // Get nearby # of events group by type
                    // endpoint: /getNearbyEvents/type?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx&type=xxx&year=xxx&month=xxx
                    connection.query(query.getEventNumByType, [locList, year, month, locList, year, month, conf.HEATMAPLIMIT], function (err, rows) {
                        if (err) {
                            return console.error('SQL Execution Error:' + err.message);
                        }

                        var typeCnts = [];

                        if (rows) {
                            console.log(rows);
                            for (let i = 0; i < rows.length; i++) {
                                typeCnts.push(rows[i]);
                            }
                        }
                        res.send(JSON.stringify(typeCnts));
                        connection.release();
                    });

                } else if (event === "showType") {
                    // Get nearby events location of specific type
                    // endpoint: /getNearbyEvents/type?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx&type=xxx&year=xxx&month=xxx
                    connection.query(query.getNearbyEventsByType, [locList, type, year, month, locList, type, year, month, conf.HEATMAPLIMIT], function (err, rows) {
                        if (err) {
                            return console.error('SQL Execution Error:' + err.message);
                        }

                        var objs = [];

                        if (rows) {
                            // console.log(rows);
                            for (let i = 0; i < rows.length; i++) {
                                objs.push(rows[i]);
                            }
                        }
                        res.send(JSON.stringify(objs));
                        connection.release();
                    });

                } else if (event === "beat") {
                    connection.query(query.getHeatmapByBeat, [locList, conf.HEATMAPLIMIT], function (err, rows) {
                        if (err) {
                            return console.error('SQL Execution Error:' + err.message);
                        }

                        var objs = [];

                        if (rows) {
                            // console.log(rows);
                            for (let i = 0; i < rows.length; i++) {
                                objs.push(rows[i]);
                            }
                        }
                        res.send(JSON.stringify(objs));
                        connection.release();
                    });

                } else {
                    //Unsupported endpoint check
                    result = {
                        code: 400,
                        msg: 'Bad Request! Unsupported endpoint!'
                    };
                    return res.status(400).json(result);
                }
            });
        });
    },

    // Get prediction for most-likely crime event by K-Means
    // endpoint: /predict?latitude=xxx&longitude=xxx&month=xxx&date=xxx&hour=xxx&minute=xxx
    crimePredict: function (req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }

            const param = req.query;
            if (param.longitude == null || param.latitude == null || param.longitude === 'undefined' || param.latitude === 'undefined') {
                result = {
                    code: 400,
                    msg: 'Bad Request! Missing parameters or undefined'
                };
                return res.status(400).json(result);
            }

            //Todo: Add field check
            const month = (param.month != null && param.month !== 'undefined') ? param.month : 3;
            const hour = (param.hour != null && param.hour !== 'undefined') ? param.hour : 14;

            // Generate parameters for query
            connection.query(query.getNearbyLocs, [param.latitude, conf.PREDICT_RANGE, param.longitude, conf.PREDICT_RANGE, conf.HEATMAPLIMIT], function (err, rows) {
                if (err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                // Deal with location miss data
                let locList = rows.filter(function (row) {
                    return row.Location != null && row.Location !== "";
                }).map(i => i.Location);

                if (locList === 'undefined' || locList.length === 0) {
                    const objs = [];
                    connection.release();
                    return res.send(JSON.stringify(objs));
                }
                ;

                connection.query(query.getPredictionDataPoints, [locList, conf.PREDICT_LIMIT], function (err, rows) {
                    if (err) {
                        return console.error('SQL Execution Error:' + err.message);
                    }

                    var dataPoints = [];
                    var typeList = [];

                    if (rows) {
                        for (let i = 0; i < rows.length; i++) {
                            // dataPoints.push({ latitude: rows[i].latitude, longitude: rows[i].longitude, month: rows[i].month, hour: rows[i].hour });
                            dataPoints.push(rows[i]);
                        }
                    }

                    const myData = [param.latitude, param.longitude, month, hour];
                    const predictions = helper.kMeansPrediction(myData, dataPoints);

                    res.send(JSON.stringify(predictions));
                    connection.release();
                });
            });
        });
    },

    // Get nearby events from official data based on square-distance for user input (Using join query!!)
    // endpoint: /getNearbyEvents/src?latitude=xxx&longitude=xxx
    getNearbySrcEvents: function (req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }

            const param = req.query;
            connection.query(query.getSrcDetail, [param.latitude, param.longitude, conf.RADIUS, param.latitude, param.longitude, conf.HEATMAPLIMIT], function (err, rows) {
                if (err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                var objs = [];

                if (rows) {
                    console.log(rows);
                    for (let i = 0; i < rows.length; i++) {
                        objs.push(rows[i]);
                    }
                    result = {
                        code: 200,
                        msg: 'Join Query Succeed!'
                    };
                }

                /* send back to client */
                res.send(JSON.stringify(objs));
                connection.release();
            });
        });
    },

    //Todo: Get records based on time field
    getRecentEvents: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if (req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }
            const param = req.query;
        });
    },

    // Create new table
    // endpoint: /createDB
    create: function (req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            connection.query(query.createUsers, function (err, result) {
                if (err) {
                    return console.error('SQL Execution Error:' + err.message);
                }
                if (result) {
                    result = {
                        code: 200,
                        msg: 'Create Database Succeed!'
                    };
                }

                res.json(result);
                connection.release();
            });
        });
    },

    load: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            connection.query(query.loadEvents, function (err, result) {
                if (err) {
                    return console.error('SQL Execution Error:' + err.message);
                }
                if (result) {
                    result = {
                        code: 200,
                        msg: 'Load Database Succeed!'
                    };
                }

                res.json(result);
                connection.release();
            });
        });
    }
};
