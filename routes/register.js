
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
      if(err){
        console.log(err);
        return res.status(500).json({ message: 'Error registering user' });
      }
    
      req.login(user, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in after registration' });
        }
        // Send user data to the frontend
        let userData={
          username: user.username,
          name: user.name,
          phoneNumber: user.phoneNumber,
          location:user.location,
          age:user.age,
          guardianPresence:user.guardianPresence
        }
        return res.status(200).json({ message: 'Registration successful', userData });
      });
    });

    // Optionally, you can generate a JWT token here and send it back in the response for immediate login
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/doctor',async(req,res)=>{
  try{
    //console.log(req.body)
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
      req.login(doctor, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in after registration' });
        }
        //Send doctor data to the frontend
        let doctorData={
          username:doctor.username,
          name:doctor.name,
          phoneNumber:doctor.phoneNumber,
          location:doctor.location,
          specialization:doctor.specialization,
          yearsOfService:doctor.yearsOfService,
          availability:doctor.availability
        }
        
        return res.status(200).json({ message: 'Registration successful', doctorData});
      });
    });

  }catch(error){
    console.error('Error registering doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
