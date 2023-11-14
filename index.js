require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const ejs = require('ejs')
const morgan = require('morgan')

const cookieParser = require('cookie-parser');
const session = require('express-session');

//Routes
const public_routes = require('./routes/routes')
const user_routes = require('./routes/users')
const staff_routes = require('./routes/employee')

//Database
const {db} = require('./model/db')

// Check if elden.ring exists in employee_record, add if not
const staffUsername = 'elden.ring';
const staffPassword = 'rosebud';

db.get('SELECT 1 FROM employee_record WHERE staff_username = ?', [staffUsername], (err, row) => {
    if (err) {
        console.error('Error checking if username exists in employee_record:', err);
        return;
    }

    if (!row) {
        // elden.ring does not exist in employee_record, add it
        bcrypt.hash(staffPassword, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                return;
            }

            db.run('INSERT INTO employee_record (staff_username, staff_password) VALUES (?, ?)',
                [staffUsername, hashedPassword], (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting elden.ring into employee_record:', insertErr);
                    } else {
                        console.log('elden.ring added to employee_record.');
                    }
                });
        });
    } else {
        console.log('elden.ring already exists in employee_record.');
    }
});

// Check if horselover1862 exists in user_record, add if not
const userUsername = 'horselover1862';
const userPassword = 'gyoubu';
const userFirstName = 'Gyoubu'; // Not required for login but required for registration
const userLastName = 'Oniwa';
const userAddress = 'Ashina Castle, Japan';
const userPhone = '911';
const userMembershipLevel = 'guest';


db.get('SELECT 1 FROM user_record WHERE user_username = ?', [userUsername], (err, row) => {
    if (err) {
        console.error('Error checking if username exists in user_record:', err);
        return;
    }

    if (!row) {
        // horselover1862 does not exist in user_record, add it
        bcrypt.hash(userPassword, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing password:', hashErr);
                return;
            }

            db.run('INSERT INTO user_record (firstname, lastname, address, phone, user_username, user_password, membership_level) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userFirstName, userLastName, userAddress, userPhone ,userUsername, hashedPassword, userMembershipLevel], (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting horselover1862 into user_record:', insertErr);
                    } else {
                        console.log('horselover1862 added to user_record.');
                    }
                });
        });
    } else {
        console.log('horselover1862 already exists in user_record.');
    }
});


// For html <form> to work
app.use(express.urlencoded({ extended: true }))

//Some setting for our website
app.use(morgan('dev'))

//Static (Pure HTML/CSS/Images)
app.use(express.static('public'));

//Parse JSON request
app.use(express.json());

//Cookie for authentication
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true
}));

// EJS can be used to render "HTML" styled page in real time (catalogue etc.)
app.set('view engine', 'ejs');

//Error route
app.get('/error', (req, res) => {
    const {message} = req.query
    res.status(500).render('error', {message}); // Render your error.ejs file
});

// Actual web page serving/functionality
// Actual Home Page can change in production
app.use('/', public_routes)
app.use('/user', user_routes)
app.use('/restricted', staff_routes)


app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})