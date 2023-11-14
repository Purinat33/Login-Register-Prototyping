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
                // return res.status(500).json({ message: 'Internal server error' });
                return res.status(500).redirect('/error?message=' + encodeURIComponent('Internal server error'));
            }

            if (row) {
                // User found, compare passwords
                bcrypt.compare(password, row[`${tableName === 'user_record' ? 'user_password' : 'staff_password'}`], (bcryptErr, bcryptResult) => {
                    if (bcryptErr) {
                        console.error('Error comparing passwords:', bcryptErr);
                        return res.status(500).redirect('/error?message=' + encodeURIComponent('Internal server error'));
                    }

                    if (bcryptResult) {
                        // Passwords match, login successful
                        // return res.status(200).json({ message: 'Login successful' });
                        req.session.isLoggedIn = true;
                        req.session.username = username;
                        
                        if (loginType === 'regularUser'){
                            req.session.isStaff = false;
                            return res.status(200).redirect('/user/dashboard');
                        }
                        else{
                            req.session.isStaff = true;
                            return res.status(200).redirect('/restricted/manage');
                        }
                            
                    } else {
                        // Passwords do not match
                        // return res.status(401).json({ message: 'Invalid credentials' });
                        return res.status(401).redirect('/error?message=' + encodeURIComponent('Invalid Credential error'));

                    }
                });
            } else {
                // Username not found in the specified table
                // return res.status(401).json({ message: 'Account does not exist' });
                return res.status(401).redirect('/error?message=' + encodeURIComponent('Account does not exists'));
            
            }
        });
    } else {
        // Invalid login type
        return res.status(400).redirect('/error?message=' + encodeURIComponent('Invalid Login Type'));
    }
}




function register_user(req, res,next){
    // Same deal with login
        const { firstname, lastname, address, phone, user_username, user_password } = req.body;

    // Check if the username already exists in the user_record table
    db.get('SELECT 1 FROM user_record WHERE user_username = ?', [user_username], (err, userRow) => {
        if (err) {
            console.error('Error checking if username exists in user_record:', err);
            return res.status(500).redirect('/error?message=' + encodeURIComponent('Internal Server Error'));
        }

        if (!userRow) {
            // Username does not exist in user_record, proceed to register
            bcrypt.hash(user_password, 10, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error('Error hashing password:', hashErr);
                    return res.status(500).redirect('/error?message=' + encodeURIComponent('Internal Server Error'));
                }

                // Insert the new user into the user_record table
                db.run('INSERT INTO user_record (firstname, lastname, address, phone, user_username, user_password, membership_level) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [firstname, lastname, address, phone, user_username, hashedPassword, 'guest'], (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting user:', insertErr);
                            return res.status(500).redirect('/error?message=' + encodeURIComponent('Internal Server Error'));
                        } else {
                            console.log('User registered successfully.');
                            return res.status(200).redirect('/login');
                        }
                    });
            });
        } else {
            // Username already exists in user_record
            return res.status(400).redirect('/error?message=' + encodeURIComponent('Username Already Exists'));
        }
    });
}


function isLoggedIn(req, res, next){
    // Check if we're logged in (Cookie?)
    if (req.session.isLoggedIn){
        next()
    }
    else{
        res.status(401).redirect('/login')
    }
}


function isStaff(req,res,next){
    // Check if staff is the one logged in
    if (req.session.isStaff){
        next()
    }
    else{
        res.status(401).redirect('/login')
    }
}


module.exports = {login_user, register_user, isLoggedIn, isStaff}