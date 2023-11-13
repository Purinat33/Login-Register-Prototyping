const express = require('express')
const router = express.Router()
const {login_user, register_user} = require('./../controller/auth')

router.get('/', (req,res)=>{
    // We will point home page to login for now
    res.status(200).render('login')
})

router.get('/login', (req,res)=>{
    res.status(200).render('login')
})

router.get('/register', (req,res)=>{
    res.status(200).render('register')
})

router.post('/auth/login', login_user);

router.post('/auth/register', register_user);

module.exports = router;