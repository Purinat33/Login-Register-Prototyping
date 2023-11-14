const sql = require('mysql2') // MySQL might be needed in production as it can handle large scale and stuff
const sqlite3 = require('sqlite3').verbose() // Though SQLite is smaller and self-contained, easy for testing
require('dotenv').config()
const path = require('path')

let db;

if (process.env.DEV === 'false'){
    //MySQL Connection (Use in production or when DEV = false)
    db = sql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
    });

    // Connect to the database and retrieve a connection from the connection pool
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return;
        }
        console.log('Connection retrieved from pool:', connection.threadId);
        connection.release();
    });

    // Listen for a connection event from the database
    if (db) {
        db.on('connection', (connection) => {
            console.log(`Connection established on connection ${connection} for db`);
        });
    } else {
        console.log('Error');
    }

}else{
    // We're still in DEV phase, so we use SQLite
    // Connecting to the database
    const sqlite_path = path.resolve(process.env.SQLITE_DB || './database.sqlite');
    db = new sqlite3.Database(sqlite_path);

    // Create tables for user and staff
    db.serialize(() => {

        db.run(`DROP TRIGGER IF EXISTS enforce_unique_username`);
        db.run(`DROP TRIGGER IF EXISTS enforce_unique_username_user`);

        // Create triggers to enforce unique usernames across both tables
        db.run(`
            CREATE TRIGGER enforce_unique_username
            BEFORE INSERT ON employee_record
            WHEN EXISTS (SELECT 1 FROM user_record WHERE user_username = NEW.staff_username)
            BEGIN
                SELECT RAISE(ABORT, 'Username already exists in user_record');
            END;
        `);

        db.run(`
            CREATE TRIGGER enforce_unique_username_user
            BEFORE INSERT ON user_record
            WHEN EXISTS (SELECT 1 FROM employee_record WHERE staff_username = NEW.user_username)
            BEGIN
                SELECT RAISE(ABORT, 'Username already exists in employee_record');
            END;
        `);
        
        db.run(`
            CREATE TABLE IF NOT EXISTS user_record (
                user_id INTEGER PRIMARY KEY,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                address TEXT NOT NULL,
                phone TEXT NOT NULL,
                user_username TEXT UNIQUE NOT NULL,
                user_password TEXT NOT NULL,
                membership_level TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS employee_record (
                staff_id INTEGER PRIMARY KEY,
                staff_username TEXT UNIQUE NOT NULL,
                staff_password TEXT NOT NULL
            )
        `);

        console.log('Tables created for user_record and employee_record');
    });

    // Connect to the database and retrieve a connection
    db.serialize(() => {
        db.get('SELECT 1', (err, row) => {
            if (err) {
                console.error('Error getting connection:', err);
            } else {
                console.log('Connection retrieved for db');
            }
        });
    });

}

module.exports = {db}
