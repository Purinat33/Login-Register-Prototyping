require('dotenv').config();
const exp = require('constants');
const express = require('express');
const app = express();
const sql = require('mysql2');
const port = 3000;
const bcrypt = require('bcrypt');
const ejs = require('ejs')
const morgan = require('morgan')

app.use(morgan('dev'))

//Static (Pure HTML)
app.use(express.static('public'));

//Parse JSON request
app.use(express.json());

app.set('view engine', 'ejs');

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




app.get('/', (req,res)=>{
    console.log('');
    res.status(200).render('employee_page')
})

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})