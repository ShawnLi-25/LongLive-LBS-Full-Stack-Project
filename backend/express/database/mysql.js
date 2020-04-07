var mysql = require('mysql');
var $conf = require('../config/mysqlConn');
var query = require('./dbQuery');
var conf = require('../config/config');
var helper = require('../helper');

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

    // User report crime record (Foreign key constriant of events, times & locations)
    // body-content: {"time": "xxx", "latitude": "xxx", "longitude": "xxx", "type": "xxx", "email": "xxx"}
    // endpoint: /report
    report: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if(req.method == "GET") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send POST!'
                };
                return res.status(400).json(result);
            }

            const bodyContent = req.body;
            // Todo: Settle down required fields: time(client side), latitude, longitude, type
            if (bodyContent == null || bodyContent.time == null || bodyContent.latitude == null || bodyContent.longitude == null || bodyContent.type == null) {
                result = {
                    code: 400,
                    msg: 'Missing Required Parameters'
                };
                res.json(result);
                return;
            }

            // Foreigh key constriant with times & locations table
            let timeParams = helper.getTimeFields();
            let locKey = helper.getLocKey(bodyContent.latitude, bodyContent.longitude);

            const insertTime = () => {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertTime, timeParams, function (err, timeRes) {
                        if(err) {
                            reject(err);
                            console.error('SQL Execution Error:' + err.message);
                        }
                        if(timeRes) {
                            console.log("Insert into times ok");
                            resolve(timeRes);
                        }
                    })
                })
            };

            const insertLoc = () => {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertLoc,
                        [locKey, bodyContent.latitude, bodyContent.longitude, bodyContent.block,
                            bodyContent.beat, bodyContent.district, bodyContent.ward, bodyContent.communityArea], function(err, locRes) {

                        if(err) {
                            reject(err);
                            return console.error('SQL Execution Error:' + err.message);
                        }
                        if(locRes) {
                            console.log("Insert into locations ok!");
                            resolve(locRes);
                        }
                    })
                })
            };

            const insertEvent = () => {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertUserRecord,
                        [timeParams[0], locKey, bodyContent.type, bodyContent.description, bodyContent.email], function (err, eventRes) {

                        if(err) {
                            reject(err);
                            console.error('SQL Execution Error:' + err.message);
                        }
                        if(eventRes) {
                            console.log("Report Done!");
                            result = {
                                code: 200,
                                msg:'Report Succeed!',
                                reportID: eventRes.insertId
                            };
                            resolve(eventRes);
                        }
                        /* send back to client */
                        res.send(result);
                        connection.release();
                    })
                })
            };

            insertTime()
            .then(insertLoc())
            .then(insertEvent())
            .catch((err) => {
                connection.close();
                return console.error('SQL Execution Error:' + err.message);
            });
        });
    },

    // Get nearby locations based on square-distance for HeatMap
    // endpoint: /getNearbyLocs?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx
    getNearbyLocs: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if(req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }

            const param = req.query;
            if(param.longitude == null || param.latitude == null || param.latDelta == null || param.lngDelta == null) {
                result = {
                    code: 400,
                    msg: 'Bad Request! Missing parameters'
                };
                return res.status(400).json(result);
            }

            var radius = Math.max(param.lngDelta, param.latDelta);

            connection.query(query.getNearbyLocs, [param.latitude, param.latDelta, param.longitude, param.lngDelta, conf.HEATMAPLIMIT], function (err, rows) {
                if(err) {
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

    // Get nearby events
    // endpoint: 1) /getNearbyEvents/heatmap?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx
    getNearbyEvents: function (req, res, next, event) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if(req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }

            const param = req.query;
            if(param.longitude == null || param.latitude == null || param.latDelta == null || param.lngDelta == null
                || param.longitude === 'undefined' || param.latitude === 'undefined'
                || event === 'detail' && param.type == null) {
                result = {
                    code: 400,
                    msg: 'Bad Request! Missing parameters or undefined'
                };
                return res.status(400).json(result);
            }

            // GetNearby Locations
            const latLimit = param.latDelta / 2, lngLimit = param.lngDelta / 2;

            var pre_query = new Date().getTime();
            connection.query(query.getNearbyLocs, [param.latitude, latLimit, param.longitude, lngLimit, conf.HEATMAPLIMIT], function (err, rows) {
                var post_query = new Date().getTime();
                var duration = (post_query - pre_query) / 1000;
                console.log("getNearbyLocs time is:" + duration);

                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                let locList = rows.map(i => i.Location);
                if (locList === 'undefined' || locList.length === 0) {
                    const objs = [];
                    connection.release();
                    return res.send(JSON.stringify(objs));
                }

                if (event === 'heatmap') {
                    pre_query = new Date().getTime();

                    connection.query(query.getHeatmapEvents, [locList, locList, conf.HEATMAPLIMIT], function (err, rows) {
                        post_query = new Date().getTime();
                        duration = (post_query - pre_query) / 1000;
                        console.log("getHeatmapEvents time is:" + duration);
                        if(err) {
                            return console.error('SQL Execution Error:' + err.message);
                        }

                        var objs = [];

                        if(rows) {
                            // console.log(rows);
                            for(let i = 0; i < rows.length; i++) {
                                objs.push(rows[i]);
                            }
                        }
                        res.send(JSON.stringify(objs));
                        connection.release();
                    });
                }

                else if(event == 'type') {
                    connection.query(query.getEventNumByType, [locList, locList, conf.HEATMAPLIMIT], function (err, rows) {
                        if (err) {
                            return console.error('SQL Execution Error:' + err.message);
                        }

                        var objs = [];

                        if (rows) {
                            console.log(rows);
                            for (let i = 0; i < rows.length; i++) {
                                objs.push(rows[i]);
                            }
                        }
                        res.send(JSON.stringify(objs));
                        connection.release();
                    });
                }

                else if (event == "detail") {
                    connection.query(query.getNearbyEventsDetails, [locList, param.type, locList, param.type, conf.HEATMAPLIMIT], function (err, rows) {
                        if (err) {
                            return console.error('SQL Execution Error:' + err.message);
                        }

                        var objs = [];

                        if (rows) {
                            console.log(rows);
                            for (let i = 0; i < rows.length; i++) {
                                objs.push(rows[i]);
                            }
                        }
                        res.send(JSON.stringify(objs));
                        connection.release();
                    });
                }

            });

        });
    },

    // Get nearby events from official data based on square-distance for user input (Using join query!!)
    // endpoint: /getNearbyEvents/src?latitude=xxx&longitude=xxx
    getNearbySrcEvents: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if(req.method == "POST") {
                result = {
                    code: 400,
                    msg: 'Bad Request! Should send GET!'
                };
                return res.status(400).json(result);
            }

            const param = req.query;
            connection.query(query.joinQuery, [param.latitude, param.longitude, conf.RADIUS, param.latitude, param.longitude, conf.HEATMAPLIMIT], function (err, rows) {
                if(err) {
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
            if(req.method == "POST") {
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
    create: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            connection.query(query.createUsers, function (err, result) {
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }
                if(result) {
                    result = {
                        code: 200,
                        msg:'Create Database Succeed!'
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
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }
                if(result) {
                    result = {
                        code: 200,
                        msg:'Load Database Succeed!'
                    };
                }

                res.json(result);
                connection.release();
            });
        });
    }
};
