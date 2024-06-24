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

// Configure Passport strategy for Doctor
passport.use('doctor', new LocalStrategy(Doctor.authenticate()));

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



//static file
app.use(express.static(path.join(__dirname, 'dist')))

//routes setup
app.use('/register', register)
app.use('/login',login)


// app.get('/', (req, res) => {
//   res.send("<H2>Welcome to home page of smartHeart</H2><button><a href='http://localhost:3000/register/user'>user register</a></button><br><button><a href='http://localhost:3000/register/doctor'>Doctor register</a></button>")
// });
app.get('/api/doctor/:username', async (req, res) => {
  try {
    const { username } = req.params;
    //console.log('from /api/doctor',username)
    // const doctor = await Doctor.findOne({ username: username });

    // if (!doctor) {
    //   return res.status(404).json({ message: 'Doctor not found' });
    // }

    appointments={
      today:'no appointments for doctor',
      tomorrow:'no appointments for doctor'
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/patient/:username', async (req, res) => {
  try {
    const { username } = req.params;
    //console.log('from /api/patient',username)
    // const doctor = await Doctor.findOne({ username: username });

    // if (!doctor) {
    //   return res.status(404).json({ message: 'Doctor not found' });
    // }

    appointments={
      today:'no appointments for patient',
      tomorrow:'no appointments for patient'
    }
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// app.get('/user/dashboard',(req,res)=>{
//   // before rendering this page we do the authentication 
//   //   process using session and passport package
//     if(req.isAuthenticated()){
//         // console.log(req.session.passport.user)
//         console.log(req.user)
//         res.send("<H3>You are authenticated successfully now you are in dashboard page</H3><H3>Your user details are</H3>"+req.user);
//     }
//     else{
//         console.log('User not authenticated!!!')
//         res.redirect("/");
//     }
// });
// app.get('/doctor/dashboard',(req,res)=>{
//   // before rendering this page we do the authentication 
//   //   process using session and passport package
//     console.log(req.user)
//     if(req.isAuthenticated()){
//         // console.log(req.session.passport)
//         res.send("<H3>You are authenticated successfully now you are in dashboard page</H3><H3>Your doctor details are</H3>"+req.user);
//     }
//     else{
//         console.log('doctor not authenticated!!!')
//         res.redirect("/");
//     }
// });
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})