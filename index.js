require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const ejs = require('ejs')
const morgan = require('morgan')

//Routes
const public_routes = require('./routes/routes')
const user_routes = require('./routes/users')
const staff_routes = require('./routes/employee')

//Database
const {db} = require('./model/db')

//Is elden.ring the username exists? if not add it
staff_username = 'elden.ring';
staff_password = 'rosebud';

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
app.use('/', public_routes)
app.use('/user', user_routes)
app.use('/restricted', staff_routes)


// We want to close the databases when we close the server (CTRL-C)
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})