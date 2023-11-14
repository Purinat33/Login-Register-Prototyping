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
staffUsername = 'elden.ring';
staffPassword = 'rosebud';

// Check if the username already exists in the user_record table
db.get('SELECT 1 FROM user_record WHERE user_username = ?', [staffUsername], (err, userRow) => {
    if (err) {
        console.error('Error checking if username exists in user_record:', err);
        // db.close();
        return;
    }

    if (!userRow) {
        // Username does not exist in user_record, proceed to check in employee_record
        db.get('SELECT 1 FROM employee_record WHERE staff_username = ?', [staffUsername], (staffErr, staffRow) => {
            if (staffErr) {
                console.error('Error checking if username exists in employee_record:', staffErr);
                // db.close();
                return;
            }

            if (!staffRow) {
                // Username does not exist in employee_record, proceed to add a new staff member
                bcrypt.hash(staffPassword, 10, (hashErr, hashedPassword) => {
                    if (hashErr) {
                        console.error('Error hashing password:', hashErr);
                        // db.close();
                        return;
                    }

                    // Insert the new staff member into the employee_record table
                    db.run('INSERT INTO employee_record (staff_username, staff_password) VALUES (?, ?)',
                        [staffUsername, hashedPassword], (insertErr) => {
                            if (insertErr) {
                                console.error('Error inserting staff member:', insertErr);
                            } else {
                                console.log('Staff member added successfully.');
                            }

                            // Close the database connection after all operations are done
                            // db.close();
                        });
                });
            } else {
                // Username already exists in employee_record
                console.log('Username already exists in employee_record.');
                // db.close();
            }
        });
    } else {
        // Username already exists in user_record
        console.log('Username already exists in user_record.');
        // db.close();
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

// EJS can be used to render "HTML" styled page in real time (catalogue etc.)
app.set('view engine', 'ejs');

// Actual web page serving/functionality
// Actual Home Page can change in production
app.use('/', public_routes)
app.use('/user', user_routes)
app.use('/restricted', staff_routes)


app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})