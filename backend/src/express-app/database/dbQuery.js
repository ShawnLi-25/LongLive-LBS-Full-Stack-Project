var query = {
    create:
        `create table if not exists events (
            eventID int primary key,
            time varchar(255) not null,
            location varchar(255) not null,
            description varchar(255),
            arrest enum('TRUE', 'FALSE') not null,
            source enum('Official', 'Report') not null
            )`,
    load:
        'LOAD DATA LOCAL INFILE \'./data/events.csv\' \n' +
        'INTO TABLE events \n' +
        'FIELDS TERMINATED BY \',\' \n' +
        'ENCLOSED BY \'"\'\n' +
        'LINES TERMINATED BY \'\\n\'\n' +
        'IGNORE 1 ROWS;',
    insert:
        'insert into events(eventID, time, location, arrest, source, description) values(?, ?, ?, ?, ?, ?)',
    queryAll:
        'select * from events',
};

module.exports = query;