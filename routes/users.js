// Users route stuff
const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('./../controller/auth')

function displayPage(req,res,next){
    const username = req.session.username;
    res.status(200).render('customer_page', {username: username})
}

router.get('/dashboard', isLoggedIn, displayPage)

module.exports = router