const sql = require('mysql2') // MySQL might be needed in production as it can handle large scale and stuff
const sqlite3 = require('sqlite3').verbose() // Though SQLite is smaller and self-contained, easy for testing
require('dotenv').config()

let user_db, staff_db;

if (process.env.DEV === 'false'){
    //MySQL Connection (Use in production or when DEV = false)
    //Connecting to the database 
    //Connecting to the database (User)
    user_db = sql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_CUSTOMER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
    });

    //Connecting to the datanase (Employee)
    staff_db = sql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_STAFF,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
    });

    // USER 
    // Connect to the database and retrieve a connection from the connection pool
    user_db.getConnection((err, connection)=>{
    if (err) { // Check if there was an error retrieving the connection
        console.error('Error getting connection from pool:', err); // Log the error to the console
        return; // Exit the function
    }
    console.log('Connection retrieved from pool:', connection.threadId); // Log the thread ID of the connection retrieved
    connection.release(); // Release the connection back to the pool
    });

    // Listen for a connection event from the database
    if(user_db){
    user_db.on('connection', (connection)=>{
        console.log(`Connection established on connection ${connection} for user db`); // Log a message when a connection is established
    });
    }else{
        console.log('Error'); // Log an error message if the connection could not be established
    }


    // Staff 
    // Connect to the database and retrieve a connection from the connection pool
    staff_db.getConnection((err, connection)=>{
    if (err) { // Check if there was an error retrieving the connection
        console.error('Error getting connection from pool:', err); // Log the error to the console
        return; // Exit the function
    }
    console.log('Connection retrieved from pool:', connection.threadId); // Log the thread ID of the connection retrieved
    connection.release(); // Release the connection back to the pool
    });

    // Listen for a connection event from the database
    if(staff_db){
    staff_db.on('connection', (connection)=>{
        console.log(`Connection established on connection ${connection} for staff db`); // Log a message when a connection is established
    });
    }else{
        console.log('Error'); // Log an error message if the connection could not be established
    }

}else{
    // We're still in DEV phase, so we use SQLite
    //Connecting to the database 
    //Connecting to the database (User)
    user_db = new sqlite3.Database(process.env.USER_DB_PATH || ':memory:');

    //Connecting to the database (Employee)
    staff_db = new sqlite3.Database(process.env.STAFF_DB_PATH || ':memory:');

    // USER 
    // Connect to the database and retrieve a connection from the connection pool
    user_db.serialize(() => {
        user_db.get('SELECT 1', (err, row) => {
            if (err) {
            console.error('Error getting connection:', err);
            } else {
            console.log('Connection retrieved for user db');
            }
        });
    });

    // Staff 
    // Connect to the database and retrieve a connection from the connection pool
    staff_db.serialize(() => {
        staff_db.get('SELECT 1', (err, row) => {
            if (err) {
            console.error('Error getting connection:', err);
            } else {
            console.log('Connection retrieved for staff db');
            }
        });
    });

}

module.exports = {user_db, staff_db}
