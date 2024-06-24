const express = require('express');
const bodyParser=require("body-parser");
const passport=require("passport");
const User = require('../models/User'); // Assuming you have a User model
const sessionMiddleware=require('../config/sessionConfig');
const Doctor = require('../models/Doctor');

const router = express.Router();



router.use(bodyParser.urlencoded({extended:true}))
router.use(express.json())

router.get('/user',(req,res)=>{
    res.send("<H3>you are in login router for login of user</H3>")
})

// router.post('/user', passport.authenticate('user', {
//     successRedirect: '/user/dashboard',
//     failureRedirect: '/login/user',
//     failureFlash: false // Enable if you're using flash messages
// }));
router.post('/user', (req, res, next) => {
    //console.log(req.body)
    passport.authenticate('user', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            // Successful login, send user data to frontend
            let userData={
                name:user.name,
                username:user.username,
                phoneNumber:user.phoneNumber,
                location:user.location,
                age:user.age,
                guardianPresence:user.guardianPresence
            }
            return res.status(200).json({ message: 'Login successful', userData });
        });
    })(req, res, next);
});
router.get('/doctor',(req,res)=>{
    res.send("<H3>you are in login router for login of doctor</H3>")
});
router.post('/doctor', (req,res,next)=>{
    passport.authenticate('doctor',(err,doctor,info)=>{
        if(err){
            return next(err);
        }
        if(!doctor){
            return res.status(401).json({message: 'Authentication failed'});
        }
        req.login(doctor,(err)=>{
            if(err){
                return next(err);
            }
            let doctorData={
                name:doctor.name,
                username:doctor.username,
                phoneNumber:doctor.phoneNumber,
                location:doctor.location,
                specialization:doctor.specialization,
                yearsOfService:doctor.yearsOfService,
                availability:doctor.availability

            }
            return res.status(200).json({message: 'Login successful',doctorData});
        });
    })(req,res,next);

});

module.exports = router;
