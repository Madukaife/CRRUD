
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const responses = require("../utils/response");
const sendSMS = require("../utils/sendSMS"); 
const generateOTP = require('../utils/generateOTP'); 
const dotenv = require("dotenv");




dotenv.config();

const signUp = async (payload) => {
  const foundEmail = await User.findOne({
    $or: [
      { email: payload.email },
      { recoveryEmail: payload.recoveryEmail }
    ]
  });
  if (foundEmail) {
    return responses.buildFailureResponse("Email already exists", 400);
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  role = payload.role;

  const savedUser = await User.create(payload);
  return responses.buildSuccessResponse(
    "Registration Successful",
    201,
    savedUser
  );
};


const login = async (payload) => {

  const foundUser = await User.findOne({
    $or: [
      { email: payload.email },
      { recoveryEmail: payload.recoveryEmail }
    ]
  });

  if (!foundUser) {
    return responses.buildFailureResponse("User details incorrect", 404);
  }

  if (!payload.password || !foundUser.password) {
    return responses.buildFailureResponse("Password details are missing", 400);
  }

  const userPassword = await bcrypt.compare(payload.password, foundUser.password);

  if (!userPassword) {
    return responses.buildFailureResponse("Invalid password", 400);
  }

  const returnData = {
    _id: foundUser._id,
    firstName: foundUser.firstName,
  };

  const authToken = jwt.sign(
    {
      email: foundUser.email,
      _id: foundUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return responses.buildSuccessResponse("Login successful", 200, {
    returnData,
    authToken,
  });
};



const sendOTP = async (payload) => {
  try {
 
    const user = await User.findOne({ recoveryEmail: payload });
    if (!user) {
      return responses.buildFailureResponse('No account associated with this recovery email. Please check and try again.', 404);
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `Your OTP is ${otp}. It is valid for 10 minutes. Please do not share this code with anyone.`;

    const smsResponse = await sendSMS(user.phoneNumber, message);
    if (!smsResponse.success) {
      return responses.buildFailureResponse('Failed to send OTP. Please try again later.', 400);
    }

    return responses.buildSuccessResponse('OTP has been sent to your registered phone number successfully.', 200);

  } catch (error) {
    return responses.buildFailureResponse('An error occurred while attempting to send the OTP. Please try again later.', 500);
  }
};


const resetPassword = async (payload) => {
  let user;

  if (payload.email && payload.resetPin) {
    user = await User.findOne({
      email: payload.email,
      resetPin: payload.resetPin,
    });

    if (!user) {
      return responses.buildFailureResponse("Invalid Email or Reset Pin", 400);
    }
  } 

  else if (payload.recoveryEmail && payload.otp) {
    user = await User.findOne({
      recoveryEmail: payload.recoveryEmail,
      otp: payload.otp,
    });

    if (!user) {
      return responses.buildFailureResponse("Invalid Recovery Email or OTP", 400);
    }
  } else {
    return responses.buildFailureResponse(
      "You must provide either email and reset pin or recovery email and OTP",
      400
    );
  }

  if (!user.resetPin && !user.otp) {
    return responses.buildFailureResponse(
      "Reset Pin or OTP has already been used",
      400
    );
  }

  const saltRounds = 10;
  const generatedSalt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(payload.password, generatedSalt);

  const updatedUser = await User.findByIdAndUpdate(
    { _id: user._id },
    { password: hashedPassword, resetPin: null, otp: null },
    { new: true }
  );

  return responses.buildSuccessResponse(
    "Password Reset Successful",
    200,
    updatedUser
  );
};


const updateProfile = async (payload) => {
  const userProfile = await User.findOne({ _id: payload._id });
  if (!userProfile) {
    return responses.buildFailureResponse("User ID not found", 400);
  }

  // If phone number is in the payload, recoveryEmail must be verified
  if (payload.phoneNumber) {
    if (!payload.recoveryEmail) {
      return responses.buildFailureResponse("Recovery email is required to update the phone number", 400);
    }

    if (userProfile.recoveryEmail !== payload.recoveryEmail) {
      return responses.buildFailureResponse("Invalid recovery email", 400);
    }
  }

  const saltRounds = 10;

  if (payload.password) {
    const generatedSalt = await bcrypt.genSalt(saltRounds);
    payload.password = await bcrypt.hash(payload.password, generatedSalt);
  }
  const updatedProfile = await User.findByIdAndUpdate(
    { _id: userProfile._id },
    payload, 
    { new: true }
  );

  return responses.buildSuccessResponse(
    "Profile updated successfully",
    200,
    updatedProfile
  );
};






module.exports = {
  signUp,
  login,
  sendOTP,
  resetPassword,
  updateProfile
};
