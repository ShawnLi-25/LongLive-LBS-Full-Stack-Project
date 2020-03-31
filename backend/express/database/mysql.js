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

    // User report crime record (Foreign key constriant of events, times & locations)
    insert: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            // URL: http://.....?x=a&y=b
            var param = req.query;

            // Todo: Settle down required fields: time(client side), latitude, longitude, type & source
            let result;
            if (param == null || param.time == null || param.latitude == null || param.longitude == null || param.type == null || param.source == null) {
                result = {
                    code: 400,
                    msg: 'Missing Required Parameters'
                };
                res.json(result);
                return;
            }

            // Foreigh key constriant with times & locations table
            let timeParams = helper.getTimeFields();
            let locKey = helper.getLocKey(param.latitude, param.longitude);

            const insertTime = () => {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertTime, timeParams, function (err, timeRes) {
                        if(err)
                            return console.error('SQL Execution Error:' + err.message);
                        if(timeRes)
                            console.log("Insert into times ok");
                    })
                })
            };

            const insertLoc = () => {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertLoc,
                        [locKey, param.latitude, param.longitude, param.block, param.beat, param.district, param.ward, param.communityArea], function(err, locRes) {

                        if(err)
                            return console.error('SQL Execution Error:' + err.message);
                        if(locRes)
                            console.log("Insert into locations ok!")
                    })
                })
            };

            const insertEvent = () => {
                return new Promise((resolve, reject) => {
                    connection.query(query.insertEvent,
                        [timeParams[0], locKey, param.type, param.arrest, param.source, param.description], function (err, eventRes) {

                        if(err)
                            return console.error('SQL Execution Error:' + err.message);
                        if(eventRes) {
                            console.log("Report Done!");
                            result = {
                                code: 200,
                                msg:'Report Succeed!'
                            };
                        }
                        res.json(result);
                        connection.release();
                    })
                })
            };

            insertTime()
            .then(insertLoc())
            .then(insertEvent())
            .catch((err) => {
                connection.close();
            });

        });
    },

    // Get nearby locations based on square-distance for HeatMap
    getNearbyLocs: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            var param = req.query;

            connection.query(query.getNearbyLocs, [param.latitude, param.longitude, param.latitude, param.longitude, conf.RADIUS], function (err, rows) {
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                var objs = [];

                let result;
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
                res.json(result);
                // res.end(JSON.stringify(objs));
                connection.release();
            });
        });
    },

    // Get nearby events based on square-distance for user input
    getNearbyEvents: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            var param = req.query;

            connection.query(query.getNearbyEvents, [param.latitude, param.longitude, param.latitude, param.longitude, conf.RADIUS, conf.EVENTNUM], function (err, rows) {
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
                        msg:'Get Clicked Events Succeed!'
                    };
                }
                res.json(result);
                // res.end(JSON.stringify(objs));
                connection.release();
            });
        });
    },

    create: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            connection.query(query.createEvent, function (err, result) {
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
