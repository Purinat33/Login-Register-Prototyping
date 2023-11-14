// Users route stuff
const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('./../controller/auth')

router.get('/dashboard', isLoggedIn)

module.exports = router