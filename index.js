require('dotenv').config();
const exp = require('constants');
const express = require('express');
const app = express();
const sql = require('mysql2');
const port = 3000;
const bcrypt = require('bcrypt');
const ejs = require('ejs')
const morgan = require('morgan')
const routes = require('./routes/routes')


//Some setting for our website
app.use(morgan('dev'))

//Static (Pure HTML/CSS/Images)
app.use(express.static('public'));

//Parse JSON request
app.use(express.json());

// EJS can be used to render "HTML" styled page in real time (catalogue etc.)
app.set('view engine', 'ejs');

// Actual web page serving/functionality
// Actual Home Page can change in production
app.use('/', routes)

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})