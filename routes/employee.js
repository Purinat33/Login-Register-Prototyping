// Employee routes stuff
const express = require('express')
const router = express.Router()
const {check_staff_status} = require('./../controller/auth')

router.get('/manage', check_staff_status)

module.exports = router