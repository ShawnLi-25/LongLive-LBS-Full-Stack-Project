var query = {
    insert:
        'insert into events(EventID, Time, Location, Type, Arrest, Source, Description) values(?, ?, ?, ?, ?, ?, ?)',
    queryAll:
        'select * from events',
    queryTest:
        'select * from events limit 5',
    createUsers:
        `create table if not exists users (
            id int(5) AUTO_INCREMENT PRIMARY KEY,
            username varchar(20),
            email varchar(50) not null,
            password varchar(50) not null,
            mobile int(11)
        ) AUTO_INCREMENT=2;`,
    createEvents:
        `create table if not exists events (
            EventID int unsigned primary key,
            Time varchar(255) not null,
            Location varchar(255) not null,
            Type varchar(255) not null,
            Description varchar(255) not null,
            Arrest enum('TRUE', 'FALSE') not null,
            Source enum('Official', 'Report') not null,
            FOREIGN KEY (Time) REFERENCES times(Time) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (Location) REFERENCES locations(Location) ON DELETE CASCADE ON UPDATE CASCADE
            )`,
    createTime:
        `create table if not exists times (
            Time varchar(255) PRIMARY KEY,
            Year int unsigned not null,
            Month int unsigned not null,
            Day int unsigned not null,            
            Hour int unsigned not null,
            Minute int unsigned not null
            )`,
    createLoc:
        `create table if not exists locations (
            Location varchar(255) PRIMARY KEY,
            Block varchar(255) not null,
            Beat int unsigned not null,
            District int unsigned not null,
            Ward int unsigned not null,
            CommunityArea int unsigned not null,
            Longitude varchar(255) not null,
            Latitude varchar(255) not null
            )`,
    createMap:
        `create table if not exists map (
            Location varchar(255),
            Block varchar(255) not null,
            LocationDescription varchar(255),
            PRIMARY KEY (Location, LocationDescription)  
            )`,
    loadEvents:
        'LOAD DATA LOCAL INFILE \'/mnt/d/react-native-project/node_modules/express-app/database/data/events.csv\' \n' +
        'INTO TABLE events \n' +
        'FIELDS TERMINATED BY \',\' \n' +
        'ENCLOSED BY \'"\'\n' +
        'LINES TERMINATED BY \'\\n\'\n' +
        'IGNORE 1 ROWS;',
    loadLocations:
        'LOAD DATA LOCAL INFILE \'/mnt/d/react-native-project/node_modules/express-app/database/data/locations.csv\' \n' +
        'INTO TABLE locations \n' +
        'FIELDS TERMINATED BY \',\' \n' +
        'ENCLOSED BY \'"\'\n' +
        'LINES TERMINATED BY \'\\n\'\n' +
        'IGNORE 1 ROWS;',
    loadTimes:
        'LOAD DATA LOCAL INFILE \'/mnt/d/react-native-project/node_modules/express-app/database/data/times.csv\' \n' +
        'INTO TABLE times \n' +
        'FIELDS TERMINATED BY \',\' \n' +
        'ENCLOSED BY \'"\'\n' +
        'LINES TERMINATED BY \'\\n\'\n' +
        'IGNORE 1 ROWS;',

};

module.exports = query;
