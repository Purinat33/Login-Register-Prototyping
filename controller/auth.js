const express = require('express')
const {db} = require('./../model/db')

function login_user(req,res,next){
    // If found in employee records, reroute the inputter to employee dashboard
    // Else reroute to user dashboard

    // Check employee record first, if not found then search user record
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