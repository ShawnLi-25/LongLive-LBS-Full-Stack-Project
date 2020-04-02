var query = {
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
    getNearbyLocs:
        'SELECT locations.Location, locations.Latitude, locations.Longitude, (POWER(? - locations.Latitude, 2) + POWER(? - locations.Longitude, 2)) as Distance ' +
        'FROM locations ' +
        'WHERE (POWER(? - locations.Latitude, 2) + POWER(? - locations.Longitude, 2)) < ? ' +
        'ORDER BY Distance ' +
        'LIMIT ?',
    getNearbyEvents:
        'SELECT Time, Type, Description ' +
        'FROM events ' +
        'WHERE events.Location IN (?)' +
        'LIMIT ?',
    queryAll:
        'SELECT * FROM events',
    login:
        'SELECT * FROM users WHERE email = ?',
    register:
        'INSERT INTO users(id, email, password) VALUES (DEFAULT, ?, ?)',
    createUsers:
        `create table if not exists users (
            id int(5) AUTO_INCREMENT PRIMARY KEY,
            username varchar(20),
            email varchar(50) not null,
            password varchar(50) not null,
            mobile int(11)
        ) AUTO_INCREMENT = 2;`,
    createEvent:
        `create table if not exists events (
            EventID int unsigned AUTO_INCREMENT PRIMARY KEY,
            Time varchar(255) not null,
            Location varchar(255) not null,
            Type varchar(255) not null,
            Description varchar(255),
            Arrest enum('TRUE', 'FALSE'),
            Source enum('Official', 'Report') not null,
            FOREIGN KEY (Time) REFERENCES times(Time) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (Location) REFERENCES locations(Location) ON DELETE CASCADE ON UPDATE CASCADE
            )`,
    createTime:
        `create table if not exists times (
            Time varchar(255) PRIMARY KEY,
            Year int unsigned not null,
            Month int unsigned not null,
            Date int unsigned not null,            
            Hour int unsigned not null,
            Minute int unsigned not null
            )`,
    createLoc:
        `create table if not exists locations (
            Location varchar(255) PRIMARY KEY,
            Block varchar(255),
            Beat int unsigned,
            District int unsigned,
            Ward int unsigned,
            CommunityArea int unsigned,
            Longitude float not null,
            Latitude float not null
            )`,
    createMap:
        `create table if not exists map (
            Location varchar(255),
            Block varchar(255) not null,
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
