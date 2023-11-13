const express = require('express')
const {user_db, staff_db} = require('./../model/db')

function login_user(req,res,next){
    // If found in employee records, reroute the inputter to employee dashboard
    // Else reroute to user dashboard

    // Check employee record first, if not found then search user record
}

function register_user(req, res,next){
    // Same deal with login
}

module.exports = {login_user, register_user}