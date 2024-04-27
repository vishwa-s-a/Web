const express = require('express');
const bodyParser=require("body-parser");
const passport=require("passport");
const User = require('../models/User'); // Assuming you have a User model
const sessionMiddleware=require('../config/sessionConfig');
const Doctor = require('../models/Doctor');

const router = express.Router();



router.use(bodyParser.urlencoded({extended:true}))

router.get('/user',(req,res)=>{
    res.send("<H3>you are in login router for login of user</H3>")
})

router.post('/user', passport.authenticate('user', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/login/user',
    failureFlash: false // Enable if you're using flash messages
}));
router.get('/doctor',(req,res)=>{
    res.send("<H3>you are in login router for login of doctor</H3>")
});
router.post('/doctor', passport.authenticate('doctor', {
    successRedirect: '/doctor/dashboard',
    failureRedirect: '/login/doctor',
    failureFlash: false // Enable if you're using flash messages
}))

module.exports = router;
