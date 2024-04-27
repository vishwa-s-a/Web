const express = require('express')
const bodyParser = require("body-parser");
const passport=require("passport");
const mongoose = require('mongoose');
const path = require('path')
const register = require('./routes/register')
const login = require('./routes/login')
const sessionMiddleware=require('./config/sessionConfig');
const User = require('./models/User');



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



passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//static file
app.use('/static', express.static(path.join(__dirname, 'public')))

//routes setup
app.use('/register', register)
app.use('/login',login)


app.get('/', (req, res) => {
  res.send("<H2>Welcome to home page of smartHeart</H2><button><a href='http://localhost:3000/register/user'>user register</a></button><br><button><a href='http://localhost:3000/register/doctor'>Doctor register</a></button>")
})
app.get('/user/dashboard',(req,res)=>{
  // before rendering this page we do the authentication 
  //   process using session and passport package
    if(req.isAuthenticated()){
        res.send("<H3>You are authenticated successfully now you are in dashboard page</H3>");
    }
    else{
        console.log('User not authenticated!!!')
        res.redirect("/register/user");
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})