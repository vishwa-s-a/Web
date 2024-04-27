const express = require('express');
const bodyParser=require("body-parser");
const passport=require("passport");
const User = require('../models/User'); // Assuming you have a User model
const sessionMiddleware=require('../config/sessionConfig');

const router = express.Router();



router.use(bodyParser.urlencoded({extended:true}))
// Use express-session middleware with MongoDB session store
// router.use(sessionMiddleware);

// router.use(passport.initialize());
// router.use(passport.session());

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

router.get('/user',(req,res)=>{
    res.send("<H3>you are in login router for login of user</H3>")
})

router.post('/user',(req,res)=>{
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
            res.redirect("/user/login")
        }
        else{
            console.log()
            passport.authenticate("local",{ failureRedirect: '/' })(req,res,function(){
                res.redirect("/user/dashboard");
            });
        }
    })
})
router.get('/doctor',(req,res)=>{
    res.send("<H3>you are in login router for login of doctor</H3>")
})

module.exports = router;
