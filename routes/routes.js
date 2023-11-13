const express = require('express')
const router = express.Router()
const {login_user, register_user} = require('./../controller/auth')

router.get('/', (req,res)=>{
    res.status(200).render('login')
})

router.get('/login', (req,res)=>{
    res.status(200).render('login')
})

router.get('/register', (req,res)=>{
    res.status(200).render('register')
})

router.post('/auth/login', (req,res)=>{
    //Login functionality
})

router.post('/auth/register', (req,res)=>{
    //Register Functionality
})

module.exports = router;