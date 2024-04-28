const express = require('express')
const bodyParser = require("body-parser");
const passport=require("passport");
const mongoose = require('mongoose');
const path = require('path')
const LocalStrategy = require('passport-local').Strategy;
const register = require('./routes/register')
const login = require('./routes/login')
const sessionMiddleware=require('./config/sessionConfig');
const User = require('./models/User');
const Doctor=require('./models/Doctor');



const app = express()
const port = 3000

//middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Configure Passport strategy for User
passport.use('user', new LocalStrategy(User.authenticate()));

// Serialize and deserialize User
passport.serializeUser(function(user, done) {
  if(user.specialization){
    done(null, { id: user.username, userType: 'doctor'} );
  }
  else{
    done(null, {id: user.username, userType: 'user'} );
  }
});

passport.deserializeUser(async function(userData, done) {
  // console.log('the user data is ',userData)
  if (userData.userType === 'user') {
    try {
      const user = await User.findOne({ username: userData.id }).exec();
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  } 
  else if(userData.userType === 'doctor') {
    try {
      const user = await Doctor.findOne({ username: userData.id }).exec();
      done(null, user);
  } catch (err) {
      done(err, null);
  }
  } else {
      done(new Error('Invalid doctor type'));
  }

});
// Configure Passport strategy for Doctor
passport.use('doctor', new LocalStrategy(Doctor.authenticate()));


//static file
app.use('/static', express.static(path.join(__dirname, 'public')))

//routes setup
app.use('/register', register)
app.use('/login',login)


app.get('/', (req, res) => {
  res.send("<H2>Welcome to home page of smartHeart</H2><button><a href='http://localhost:3000/register/user'>user register</a></button><br><button><a href='http://localhost:3000/register/doctor'>Doctor register</a></button>")
});
app.get('/user/dashboard',(req,res)=>{
  // before rendering this page we do the authentication 
  //   process using session and passport package
    if(req.isAuthenticated()){
        // console.log(req.session.passport.user)
        console.log(req.user)
        res.send("<H3>You are authenticated successfully now you are in dashboard page</H3><H3>Your user details are</H3>"+req.user);
    }
    else{
        console.log('User not authenticated!!!')
        res.redirect("/register/user");
    }
});
app.get('/doctor/dashboard',(req,res)=>{
  // before rendering this page we do the authentication 
  //   process using session and passport package
    console.log(req.user)
    if(req.isAuthenticated()){
        // console.log(req.session.passport)
        res.send("<H3>You are authenticated successfully now you are in dashboard page</H3><H3>Your doctor details are</H3>"+req.user);
    }
    else{
        console.log('doctor not authenticated!!!')
        res.redirect("/register/doctor");
    }
});
// Logout route handler
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Error logging out');
      } else {
          // Redirect the user to the login page or any other appropriate page
          res.redirect('/');
      }
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})