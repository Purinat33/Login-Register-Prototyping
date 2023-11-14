const express = require('express')
const {db} = require('./../model/db')

const bcrypt = require('bcrypt');

function login_user(req, res, next) {
    const { username, password, loginType } = req.body;

    // Check login type
    if (loginType === 'regularUser' || loginType === 'employeeUser') {
        const tableName = (loginType === 'regularUser') ? 'user_record' : 'employee_record';

        // Query the corresponding table based on loginType
        db.get(`SELECT * FROM ${tableName} WHERE ${tableName === 'user_record' ? 'user_username' : 'staff_username'} = ?`, [username], (err, row) => {
            if (err) {
                console.error('Error during login:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (row) {
                // User found, compare passwords
                bcrypt.compare(password, row[`${tableName === 'user_record' ? 'user_password' : 'staff_password'}`], (bcryptErr, bcryptResult) => {
                    if (bcryptErr) {
                        console.error('Error comparing passwords:', bcryptErr);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (bcryptResult) {
                        // Passwords match, login successful
                        return res.status(200).json({ message: 'Login successful' });
                    } else {
                        // Passwords do not match
                        return res.status(401).json({ message: 'Invalid credentials' });
                    }
                });
            } else {
                // Username not found in the specified table
                return res.status(401).json({ message: 'Account does not exist' });
            }
        });
    } else {
        // Invalid login type
        return res.status(400).json({ message: 'Invalid login type' });
    }
}




function register_user(req, res,next){
    // Same deal with login
}

function check_staff_status(req,res,next){
    // Check if staff is the one logged in

}

function isLoggedIn(req, res, next){
    // Check if we're logged in (Cookie?)
}

module.exports = {login_user, register_user, check_staff_status, isLoggedIn}