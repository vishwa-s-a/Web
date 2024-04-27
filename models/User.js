// Assuming this is your server-side (Node.js/Express.js) code

const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  medicalConditions: {
    type: [String], // Assuming medicalConditions is an array of strings
    default: [] // Default to an empty array if not provided
  },
  guardianPresence: {
    type: Boolean,
    default: false // Default to false if not provided
  }
});

userSchema.plugin(passportLocalMongoose);
// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
