const sql = require('mysql2')

//Connecting to the database 
//Connecting to the database (User)
const user_db = sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_CUSTOMER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
});

//Connecting to the datanase (Employee)
const staff_db = sql.createPool({
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

module.exports = {user_db, staff_db}
