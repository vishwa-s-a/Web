
const express = require('express');
const bodyParser=require("body-parser");
const passport=require("passport");
const router = express.Router();

const User = require('../models/User'); // Assuming you have a User model
//const sessionMiddleware=require('../config/sessionConfig');

router.use(bodyParser.urlencoded({extended:true}))
// Use express-session middleware with MongoDB session store
// router.use(sessionMiddleware);

// router.use(passport.initialize());
// router.use(passport.session());

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Route for user registration
router.get('/user',(req,res)=>{
  res.send("<H3>you are in register router for registration of user</H3><button><a href='http://localhost:3000/login/user'>user login</a></button><br><button><a href='http://localhost:3000/login/doctor'>Doctor login</a></button>")
})
router.post('/user', async (req, res) => {
  try {
    const { username, name, password, medicalConditions, guardianPresence } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create a new user object
    const newUser = new User({
      username: username,
      name: name,
      medicalConditions: medicalConditions,
      guardianPresence:guardianPresence
    });

    // Save the user to the database
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect('/register')
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
})

module.exports = router;
