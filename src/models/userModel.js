
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
 
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password:{
    type: String

  },
  recoveryEmail: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String 
  },
  otpExpiry: { 
    type: Date 
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);



