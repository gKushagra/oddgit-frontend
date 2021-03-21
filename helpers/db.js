const sqlite = require('sqlite3').verbose();
const logger = require('../logger/logger');

// common methods
function connectDB() {
    return new sqlite.Database('/Users/kush/Documents/Kush/NewProjects/oddgit-db/oddgit.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
        if (err)
            logger.log({ level: 'error', message: `sqlite connect error ${err}` });

        logger.log({ level: 'info', message: 'connected to db' });
    });
}

function disconnectDB(conn) {
    conn.close((err) => {
        if (err)
            logger.log({ level: 'error', message: `sqlite disconnect error ${error}` });

        logger.log({ level: 'info', message: 'disconnected from db' });
    });
}

function getQuery(conn, query, callback) {
    conn.get(query, [], function (err, row) {
        if (err)
            logger.log({ level: 'error', message: 'query error' });

        return callback(row);
    });
}

function runQueryTable(conn, query, callback) {
    conn.run(query, [], function (err) {
        if (err)
            logger.log({ level: 'error', message: 'query error' });

        logger.log({ level: 'info', message: 'query successful' });
        return callback();
    });
}

// useful only if tables do not exist, create them
function ifNotExistCreateTables(conn) {
    conn.run(`CREATE TABLE IF NOT EXISTS users(
        username INTEGER NOT NULL,
        email TEXT PRIMARY KEY,
        displayName TEXT,
        useDisplayName NUMERIC NOT NULL,
        password TEXT NOT NULL,
        dateJoined INTEGER NOT NULL,
        dateLastUpdated INTEGER,
        dateResetToken INTEGER,
        resetToken TEXT
    );`);

    conn.run(`CREATE TABLE IF NOT EXISTS repositories(
        name INTEGER PRIMARY KEY,
        description TEXT, 
        dateCreated INTEGER NOT NULL,
        dateLastUpdated INTEGER,
        dateResetToken INTEGER,
        stars TEXT,
        collaborators TEXT
    );`)
}

module.exports = {
    connectDB,
    disconnectDB,
    getQuery,
    runQueryTable,
    ifNotExistCreateTables,
}