// Employee routes stuff
const express = require('express')
const router = express.Router()
const {isLoggedIn, isStaff} = require('./../controller/auth')

function displayPage(req,res,next){
    const username = req.session.username;
    res.status(200).render('employee_page', {username: username})
}

router.get('/manage', isLoggedIn, isStaff, displayPage)

module.exports = router