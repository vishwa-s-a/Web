
const express = require('express');
const bodyParser=require("body-parser");
const passport=require("passport");
const router = express.Router();

const User = require('../models/User'); // Assuming you have a User model
const Doctor=require('../models/Doctor');
//const sessionMiddleware=require('../config/sessionConfig');

router.use(bodyParser.urlencoded({extended:true}))

// Route for user registration
router.get('/user',(req,res)=>{
  res.send("<H3>you are in register router for registration of user</H3><button><a href='http://localhost:3000/login/user'>user login</a></button><br><button><a href='http://localhost:3000/login/doctor'>Doctor login</a></button>")
})
router.post('/user', async (req, res) => {
  try {
    const { username, firstName, lastName,phoneNumber,countryCode,location, medicalConditions, guardianPresence } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Split the string containing medical conditions into an array
    const medicalConditionsArray = medicalConditions.split(',');
    // Create a new user object
    const newUser = new User({
      username: username,
      firstName: firstName,
      lastName:lastName,
      phoneNumber: phoneNumber,
      countryCode: countryCode,
      location:location,
      medicalConditions: medicalConditionsArray,
      guardianPresence:guardianPresence
    });

    // Save the user to the database
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect('/register/user')
      }
    
      // Authentication after successful registration
      passport.authenticate("local")(req, res, function() {
        res.redirect("/user/dashboard");
      });
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

    const {username,name,specialization,yearsOfService,availability}=req.body;

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
      specialization:specialization,
      yearsOfService:parseInt(yearsOfService),
      availability:availabilityArray
    });

    Doctor.register(newDoctor,req.body.password,function(err,doctor){
      if(err){
        console.log(err);
        res.redirect('/register/doctor')
      }
      passport.authenticate("doctor")(req,res,function(){
        res.redirect('/doctor/dashboard')
      });
    });

  }catch(error){
    console.error('Error registering doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
