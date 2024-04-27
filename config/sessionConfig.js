const session=require("express-session");
const MongoDBSessionStore = require('connect-mongodb-session')(session);
const moment = require('moment-timezone'); // Import the moment-timezone library

// Calculate the expiration time in the desired timezone
const currentTime = moment.tz('Asia/Kolkata'); // Get current time in Indian timezone
const expirationTime = currentTime.add(30, 'minutes'); // Add 30 minutes to the current time
const expirationTimeUTC = expirationTime.utc().toDate(); // Convert to JavaScript Date object

const store = new MongoDBSessionStore({
  uri: 'mongodb://localhost:27017/test', // MongoDB connection URI
  collection: 'sessions', // Name of the collection to store sessions
  databaseName: 'test', // Name of your MongoDB database
});

// Catch errors
store.on('error', function(error) {
  console.error('MongoDB session store error:', error);
});


const sessionMiddleware=session({
    secret: 'YourSecretKey_should be big',
    resave: false,
    saveUninitialized: false,
    store: store, // Use MongoDB session store
    cookie: {
      secure: false, // Ensures cookies are only sent over HTTP
      maxAge: 1800000, // Cookie expires after 30 minutes
      expires:expirationTimeUTC
      // Other options...
    }
  })

module.exports = sessionMiddleware;
