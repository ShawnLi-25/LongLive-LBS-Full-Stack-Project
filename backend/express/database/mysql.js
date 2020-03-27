var mysql = require('mysql');
var $conf = require('../config/mysqlConn');
var query = require('./dbQuery');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: $conf.mysql.host,
    user: $conf.mysql.user,
    password: $conf.mysql.password,
    database: $conf.mysql.database,
    port: $conf.mysql.port
});

module.exports = {
    insert: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            var param = req.query;
            if(param == null || param.eventID == null || param.time == null || param.location == null || param.arrest == null || param.source == null) {
                jsonWrite(res, 'undefined');
                return;
            }

            connection.query(query.insert, [param.eventID, param.time, param.location, param.arrest, param.source], function (err, result) {
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }
                if(result) {
                    result = {
                        code: 200,
                        msg:'Insert to Database Succeed!'
                    };
                }

                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    query: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }

            connection.query(query.queryTest, function (err, result) {
                if(err) {
                    return console.error('SQL Execution Error:' + err.message);
                }

                jsonWrite(res, result);
                connection.release();
            });
        });
    },

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

                jsonWrite(res, result);
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

                jsonWrite(res, result);
                connection.release();
            });
        });
    }
};

/* Write result to json object */
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'Json Write Fail'
        });
    } else {
        res.json(ret);
    }
};