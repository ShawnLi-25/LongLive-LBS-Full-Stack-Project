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

            connection.query(query.insert, [param.eventID, param.time, param.location, param.arrest, param.source] function (err, result) {
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

    create: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                return console.error('Connection Error:' + err.message);
            }
            connection.query(query.create, function (err, result) {
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
            connection.query(query.load, function (err, result) {
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
/*
connection.connect(function (err) {
    if (err) {
        return console.error('Connection Error:' + err.message);
    }

    var query = {
        create:
            `create table if not exists events (
            eventID int primary key auto_increment,
            time varchar(255) not null,
            location varchar(255) not null,
            description varchar(255),
            arrest enum('Yes', 'No') not null,
            source enum('Official', 'Report') not null
            )`,
        load:
            'LOAD DATA INFILE \'./data/events.csv\' \n' +
            'INTO TABLE discounts \n' +
            'FIELDS TERMINATED BY \',\' \n' +
            'ENCLOSED BY \'"\'\n' +
            'LINES TERMINATED BY \'\\n\'\n' +
            'IGNORE 1 ROWS;'
    };

    connection.query(query.create, function (err, results, fields) {
        if (err) {
            console.log('Query Error:' + err.message);
        }
    });

    connection.query(query.load, function (err, results, fields) {
        if (err) {
            console.log('Query Error:' + err.message);
        }
    });

    connection.end(function (err) {
        if (err) {
            return console.error('End Error:' + err.message);
        }
    });
});
*/