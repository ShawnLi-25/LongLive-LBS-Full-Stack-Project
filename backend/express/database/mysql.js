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

            var bodyContent = req.body;
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
                                msg:'Report Succeed!'
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
    // endpoint: /getNearbyLocs?latitude=xxx&longitude=xxx
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

            var param = req.query;
            connection.query(query.getNearbyLocs, [param.latitude, param.longitude, param.latitude, param.longitude, conf.RADIUS, conf.HEATMAPLIMIT], function (err, rows) {
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

    // Get nearby events based on square-distance for user input
    // endpoint: /getNearbyEvents?latitude=xxx&longitude=xxx
    getNearbyEvents: function (req, res, next) {
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

            var param = req.query;
            connection.query(query.getNearbyLocs, [param.latitude, param.longitude, param.latitude, param.longitude, conf.RADIUS, conf.HEATMAPLIMIT], function (err, rows) {
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                let locList = rows.map(i => i.Location);

                connection.query(query.getNearbyEvents, [locList, conf.EVENTNUM], function (err, rows) {
                    if(err) {
                        return console.error('SQL Execution Error:' + err.message);
                    }

                    var objs = [];

                    if(rows) {
                        console.log(rows);
                        for(let i = 0; i < rows.length; i++) {
                            objs.push(rows[i]);
                        }
                        result = {
                            code: 200,
                            msg:'Get Nearby Events Succeed!'
                        };
                    }

                    res.send(JSON.stringify(objs));
                    connection.release();
                });
            });

        });
    },

    create: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            connection.query(query.createUserRecord, function (err, result) {
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
