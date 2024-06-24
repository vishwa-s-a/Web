
const express = require('express');
const bodyParser=require("body-parser");
const passport=require("passport");
const router = express.Router();

const User = require('../models/User'); // Assuming you have a User model
const Doctor=require('../models/Doctor');
//const sessionMiddleware=require('../config/sessionConfig');

router.use(bodyParser.urlencoded({extended:true}))
router.use(express.json())

// Route for user registration
router.get('/user',(req,res)=>{
  res.send("<H3>you are in register router for registration of user</H3><button><a href='http://localhost:3000/login/user'>user login</a></button><br><button><a href='http://localhost:3000/login/doctor'>Doctor login</a></button>")
})
router.post('/user', async (req, res) => {
  try {
    let username=req.body.email;
    let name=req.body.name;
    let phoneNumber=req.body.phoneNumber;
    let location=req.body.location;
    let age=req.body.age;
    let guardianPresence=req.body.guardianPresence;
    // Check if the email is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Split the string containing medical conditions into an array
    //const medicalConditionsArray = medicalConditions.split(',');
    // Create a new user object
    const newUser = new User({
      username: username,
      name: name,
      phoneNumber: phoneNumber,
      location:location,
      age:parseInt(age),
      guardianPresence:guardianPresence
    });

    // Save the user to the database
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect('/register/user')
      }
    
      // // Authentication after successful registration
      // passport.authenticate("user")(req, res, function() {
      //   res.redirect("/user/dashboard");
      // });
      // return res.status(200).json({ message: 'Registration successful' });

      passport.authenticate('user', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/register/user',
        failureFlash: false // Enable if you're using flash messages
      });
      return res.status(200).json({ message: 'Registration successful' });
    });

    // Optionally, you can generate a JWT token here and send it back in the response for immediate login
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/doctor',(req,res)=>{
  res.send('<H3>you are in register router for registration of doctor</H3>')
});
router.post('/doctor',async(req,res)=>{
  try{
    console.log(req.body)
    let username=req.body.email;
    let name=req.body.name;
    let specialization=req.body.specialization;
    let yearsOfService=req.body.yearsOfService;
    let availability=req.body.availability;
    let phoneNumber=req.body.phoneNumber;
    let location=req.body.location;
    // const {username,name,specialization,yearsOfService,availability}=req.body;

    //check if the email is already registered
    const existingDoctor=await Doctor.findOne({username});
    if(existingDoctor){
      return res.status(400).json({message:'Email already registered, you can login'});

    }

    //split the string containing the availability
    const availabilityArray=availability.split(',');

    //create a new doctor object
    const newDoctor= new Doctor({
      username:username,
      name:name,
      phoneNumber:phoneNumber,
      location:location,
      specialization:specialization,
      yearsOfService:parseInt(yearsOfService),
      availability:availabilityArray,

    });

    Doctor.register(newDoctor,req.body.password,function(err,doctor){
      if(err){
        console.log(err);
        return res.status(500).json({ message: 'Error registering doctor' });
      }
      console.log('doctor is waiting')
      // passport.authenticate('doctor', {
      //   successRedirect: '/doctor/dashboard',
      //   failureRedirect: '/register/doctor',
      //   failureFlash: false // Enable if you're using flash messages
      // })
      // Authenticate the doctor after successful registration
        passport.authenticate('doctor', {
            successRedirect: '/doctor/dashboard',
            failureRedirect: '/register/doctor',
            failureFlash: false // Enable if you're using flash messages
        });
        return res.status(200).json({ message: 'Registration successful' });
    });

  }catch(error){
    console.error('Error registering doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
