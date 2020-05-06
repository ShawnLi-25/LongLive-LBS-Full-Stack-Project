var query = {
    /******  MongoDB  ******/

    // User Report
    insertUserRecordMongo: function (collection, params, callback) {
        collection.insertOne(
            {
                _id: params.reportId, email: params.email, latitude: params.latitude, longitude: params.longitude,
                time: params.time, type: params.type, description: params.description
            },

            (err, result) => {
                if (err) {
                    console.log("MongoDB InsertOne Error" + err.message);
                }
                callback(result.ops[0]);
            });
    },

    updateUserRecordMongo: function (collection, reportId, params, callback) {
        collection.update(
            { _id: reportId },
            {
                $set: {
                    type: params.type,
                    description: params.description
                }
            },

            (err, result) => {
                if (err) {
                    console.log("MongoDB Update Error" + err.message);
                }
                callback(result);
            });
    },

    insertImage: function (collection, reportId, img, callback) {
        collection.insertOne(
            {_id: reportId, img: img},

            (err, result) => {
                if (err) {
                    console.log("MongoDB InsertOne Image Error" + err.message);
                }
                callback(result.ops[0]);
            });
    },

    // Find most frequent crime type in a ward now (MapReduce flow here)
    wardPredict: function (collection, callback) {
        collection.mapReduce(
            function () {
                emit(this.ward, this.crime_type);
            },
            function (ward, types) {
                var res = [];
                var typeCnt = {};

                for (let i = 0; i < types.length; ++i) {
                    let type = types[i];
                    if (type in typeCnt) {
                        ++typeCnt[type];
                    } else {
                        typeCnt[type] = 1;
                    }
                }

                var maxVal = 0;
                for (let [key, value] of Object.entries(typeCnt)) {
                    if (value > maxVal) {
                        res = key;
                        maxVal = value;
                    }
                }
                return res;
            },
            {out: {inline: 1}},
            function (err, result) {
                if (err) {
                    return console.error('Mongo MapReduce Error:' + err.message);
                }
                callback(result);
            }
        );
    },

    // General query
    deleteOne: function (collection, deleteId, callback) {
        collection.deleteOne(
            {_id: deleteId},

            (err, result) => {
                // console.log(deleteid);
                if (err) {
                    console.log("MongoDB deleteOne Error" + err.message);
                }
                callback(result);
            })
    },

    findAll: function (collection, callback) {
        collection.find().toArray(function (err, items) {
            callback(items);
        });
    },

    findOne: function (collection, callback) {
        collection.findOne(
            (err, item) => {
                if (err) {
                    console.log("MongoDB findOne Error" + err.message);
                }
                callback(item);
            });
    },

    /******  MySQL  ******/
    insertUserRecord:
        'INSERT INTO userRecords(Time, Location, Type, Description, email) ' +
        'VALUES (?, ?, ?, ?, ?)',
    insertEvent:
        'INSERT INTO events(Time, Location, Type, Arrest, Source, Description) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
    insertTime:
        'INSERT IGNORE INTO times(Time, Year, Month, Date, Hour, Minute) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
    insertLoc:
        'INSERT INTO locations(Location, Latitude, Longitude, Block, Beat, District, Ward, CommunityArea) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)' +
        'ON DUPLICATE KEY UPDATE Block = VALUES(Block), Beat = VALUES(Beat), District = VALUES(District), Ward = VALUES(Ward), CommunityArea = VALUES(CommunityArea)',
    updateUserRecord:
        'UPDATE userRecords SET Type = ?, Description = ? ' +
        'WHERE ReportID = ?',
    deleteUserRecord:
        'DELETE FROM userRecords ' +
        'WHERE ReportID = ?',
    getUserRecord:
        'SELECT * FROM userRecords ' +
        'WHERE ReportID = ?',
    getNearbyLocs:
        'SELECT locations.Location, locations.Latitude, locations.Longitude ' +
        'FROM locations ' +
        'WHERE ABS(? - locations.Latitude) < ? AND ABS(? - locations.Longitude) < ? ' +
        'LIMIT ?',
    getPredictionDataPoints:
        'SELECT DISTINCT L.Latitude AS latitude, L.Longitude AS longitude, T.Month As month, T.Hour AS hour, E.Type AS type ' +
        'FROM locations L NATURAL JOIN events E ' +
        'NATURAL JOIN times T ' +
        'WHERE E.Location IN (?)' +
        'LIMIT ?',
    getHeatmapEvents:
        'SELECT DISTINCT L.Latitude AS latitude, L.Longitude AS longitude ' +
        'FROM locations L NATURAL JOIN events E ' +
        'NATURAL JOIN times T ' +
        'WHERE E.Location IN (?) AND T.Year = ? AND T.Month = ? ' +
        'UNION ' +
        'SELECT L2.Latitude, L2.Longitude ' +
        'FROM locations L2 NATURAL JOIN userRecords U ' +
        'NATURAL JOIN times T2 ' +
        'WHERE U.Location IN (?) AND T2.Year = ? AND T2.Month = ? ' +
        'LIMIT ?',
    getHeatmapByBeat:
        'SELECT DISTINCT L.Beat, COUNT(*) AS Num, AVG(L.Latitude) AS Lat, AVG(L.Longitude) AS Lng ' +
        'FROM locations L NATURAL JOIN events E ' +
        'WHERE E.Location IN (?) ' +
        'GROUP BY L.Beat ' +
        'LIMIT ?',
    getNearbyEventsByType:
        'SELECT DISTINCT L.Latitude AS latitude, L.Longitude AS longitude ' +
        'FROM locations L NATURAL JOIN events E ' +
        'NATURAL JOIN times T ' +
        'WHERE E.Location IN (?) AND E.Type = ? AND T.Year = ? AND T.Month = ? ' +
        'UNION ' +
        'SELECT L2.Latitude, L2.Longitude ' +
        'FROM locations L2 NATURAL JOIN userRecords U ' +
        'NATURAL JOIN times T2 ' +
        'WHERE U.Location IN (?) AND U.Type = ? AND T2.Year = ? AND T2.Month = ? ' +
        'LIMIT ?',
    getEventsDetails:
        'SELECT Time, Location, Type, Description ' +
        'FROM events ' +
        'WHERE events.Location IN (?) AND events.Type = ? ' +
        'UNION ' +
        'SELECT Time, Location, Type, Description ' +
        'FROM userRecords ' +
        'WHERE userRecords.Location IN (?) AND userRecords.Type = ? ' +
        'LIMIT ?',
    getEventNumByType:
        'SELECT Type, COUNT(*) AS Num ' +
        'FROM (' +
        'SELECT Type ' +
        'FROM events ' +
        'NATURAL JOIN times T ' +
        'WHERE events.Location IN (?) AND T.Year = ? AND T.Month = ? ' +
        'UNION ALL ' +
        'SELECT Type ' +
        'FROM userRecords ' +
        'NATURAL JOIN times T2 ' +
        'WHERE userRecords.Location IN (?) AND T2.Year = ? AND T2.Month = ? ' +
        'LIMIT ?' +
        ') t ' +
        'GROUP BY Type',
    getSrcDetail:
        'SELECT E.Time, E.Type, E.Description ' +
        'FROM events E NATURAL JOIN locations L ' +
        'WHERE L.Location IN (' +
        'SELECT L2.Location ' +
        'FROM locations L2 ' +
        'WHERE (POWER(? - L2.Latitude, 2) + POWER(? - L2.Longitude, 2)) < ? ' +
        'ORDER BY (POWER(? - L2.Latitude, 2) + POWER(? - L2.Longitude, 2)))' +
        'LIMIT ?',
    queryAll:
        'SELECT * FROM events',
    login:
        'SELECT * FROM users WHERE email = ?',
    register:
        'INSERT INTO users(id, email, password, username, mobile) VALUES (DEFAULT, ?, ?, ?, ?)',
    createUsers:
        `create table if not exists users (
            id int(5) AUTO_INCREMENT PRIMARY KEY,
            username varchar(20),
            email varchar(50) not null,
            password varchar(100) not null,
            mobile int(11)
        ) AUTO_INCREMENT = 2;`,
    createUserRecord:
        `create table if not exists userRecords (
            ReportID int unsigned AUTO_INCREMENT PRIMARY KEY,
            email varchar(50),
            Time varchar(64) not null,
            Location varchar(64) not null,
            Type varchar(64) not null,
            Description varchar(255),
            FOREIGN KEY (Time) REFERENCES times(Time) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (Location) REFERENCES locations(Location) ON DELETE CASCADE ON UPDATE CASCADE
        )`,
    createEvent:
        `create table if not exists events (
            EventID int unsigned AUTO_INCREMENT PRIMARY KEY,
            Time varchar(64) not null,
            Location varchar(64) not null,
            Type varchar(64) not null,
            Description varchar(255),
            Arrest enum('TRUE', 'FALSE'),
            Source enum('Official', 'Report'),
            FOREIGN KEY (Time) REFERENCES times(Time) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (Location) REFERENCES locations(Location) ON DELETE CASCADE ON UPDATE CASCADE
            )`,
    createTime:
        `create table if not exists times (
            Time varchar(64) PRIMARY KEY,
            Year int unsigned not null,
            Month int unsigned not null,
            Date int unsigned not null,            
            Hour int unsigned not null,
            Minute int unsigned not null
            )`,
    createLoc:
        `create table if not exists locations (
            Location varchar(64) PRIMARY KEY,
            Block varchar(64),
            Beat int unsigned,
            District int unsigned,
            Ward int unsigned,
            CommunityArea int unsigned,
            Latitude double(14, 9) not null,
            Longitude double(14, 9) not null
            )`,
    createMap:
        `create table if not exists map (
            Location varchar(64),
            Block varchar(64) not null,
            LocationDescription varchar(255),
            PRIMARY KEY (Location, LocationDescription)  
            )`,
    loadEvents:
        'LOAD DATA LOCAL INFILE \'/mnt/d/20Spring/CS411/LongLive/backend/data/srcdata/events.csv\' \n' +
        'INTO TABLE events \n' +
        'FIELDS TERMINATED BY \',\' \n' +
        'ENCLOSED BY \'"\'\n' +
        'LINES TERMINATED BY \'\\n\'\n' +
        'IGNORE 1 ROWS;',
    loadLocations:
        'LOAD DATA LOCAL INFILE \'/mnt/d/20Spring/CS411/LongLive/backend/data/srcdata/locations.csv\' \n' +
        'INTO TABLE locations \n' +
        'FIELDS TERMINATED BY \',\' \n' +
        'ENCLOSED BY \'"\'\n' +
        'LINES TERMINATED BY \'\\n\'\n' +
        'IGNORE 1 ROWS;',
    loadTimes:
        'LOAD DATA LOCAL INFILE \'/mnt/d/20Spring/CS411/LongLive/backend/data/srcdata/times.csv\' \n' +
        'INTO TABLE times \n' +
        'FIELDS TERMINATED BY \',\' \n' +
        'ENCLOSED BY \'"\'\n' +
        'LINES TERMINATED BY \'\\n\'\n' +
        'IGNORE 1 ROWS;',

};

module.exports = query;
