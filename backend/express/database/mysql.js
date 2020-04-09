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

    // User report crime record (Foreign key constraint of events, times & locations)
    // body-content: {"time": "xxx", "latitude": "xxx", "longitude": "xxx", "type": "xxx", "description": "xxx", "email": "xxx"}
    // endpoint: /report
    reportUserRecord: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if(req.method === "GET") {
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
                                msg:'Report Succeed',
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

    // Update user report crime record
    // body-content: {"reportID": "xxx", "type": "xxx"}
    // endpoint: /report
    updateUserRecord: function(req, res, next) {
        pool.getConnection( function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if(req.method !== "PUT") {
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
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                if(row.length === 0) {
                    result = {
                        code: 404,
                        msg: "Record not found!"
                    }
                }

                let type = bodyContent.type == null ? row.Type : bodyContent.type;
                let description = bodyContent.description == null ? row.Description : bodyContent.description;

                connection.query(query.updateUserRecord, [type, description, reportID], function (err, updateRes) {
                    if(err) {
                        return console.error('SQL Execution Error:' + err.message);
                    }

                    if(updateRes) {
                        console.log("Update Report Done!");
                        result = {
                            code: 200,
                            msg: "Update report succeed"
                        }
                    }
                    res.send(result);
                    connection.release();
                });
            });

        })
    },

    // Delete user report crime record
    // endpoint: /report/reportID
    deleteUserRecord: function(req, res, next) {
        pool.getConnection( function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            let result;
            if(req.method !== "DELETE") {
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

            connection.query(query.deleteUserRecord, [reportID], function (err, delRes) {
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                if(delRes) {
                    console.log("Delete Report Done!");
                    result = {
                        code: 200,
                        msg:'Delete report succeed!',
                    };
                }
                /* send back to client */
                res.send(result);
                connection.release();
            });

        })
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

    // Get nearby events based on location & time
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
            // Todo: no hardcode
            const year = param.year != null ? param.year : new Date().getFullYear();
            const month = param.month != null ? param.month : new Date().getMonth();
            const type = param.type != null ? param.type.toUpperCase() : "HOMICIDE";

            connection.query(query.getNearbyLocs, [param.latitude, latLimit, param.longitude, lngLimit, conf.HEATMAPLIMIT], function (err, rows) {
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                // Deal with location miss data
                let locList = rows.filter(function(row) {
                    return row.Location != null && row.Location !== "";
                }).map(i => i.Location);

                if (locList === 'undefined' || locList.length === 0) {
                    const objs = [];
                    connection.release();
                    return res.send(JSON.stringify(objs));
                }
                // Get nearby events location for heatmap
                // endpoint: /getNearbyEvents/heatmap?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx&year=xxx&month=xxx
                if (event === 'heatmap') {

                    connection.query(query.getHeatmapEvents, [locList, year, month, locList, year, month, conf.HEATMAPLIMIT], function (err, rows) {
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
                // Get nearby # of events group by type
                // endpoint: /getNearbyEvents/type?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx&type=xxx&year=xxx&month=xxx
                else if (event === 'type') {
                    connection.query(query.getEventNumByType, [locList, year, month, locList, year, month, conf.HEATMAPLIMIT], function (err, rows) {
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
                // Get nearby events location of specific type
                // endpoint: /getNearbyEvents/type?latitude=xxx&longitude=xxx&latDelta=xxx&lngDelta=xxx&type=xxx&year=xxx&month=xxx
                else if (event === "showType") {
                    connection.query(query.getNearbyEventsByType, [locList, type, year, month, locList, type, year, month, conf.HEATMAPLIMIT], function (err, rows) {
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
                //Unsupported endpoint check
                else {
                    result = {
                        code: 400,
                        msg: 'Bad Request! Should send GET!'
                    };
                    return res.status(400).json(result);
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
            connection.query(query.getSrcDetail, [param.latitude, param.longitude, conf.RADIUS, param.latitude, param.longitude, conf.HEATMAPLIMIT], function (err, rows) {
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
