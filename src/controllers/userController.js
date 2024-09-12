
const userServices = require("../services/userService");
const responses = require("../utils/response");

const signUpController = async (req, res) => {
  const Data = req.body;

  try {
    const data = await userServices.signUp(Data);
    return res.status(data.statusCode || 200).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message || "An error occurred during sign-up.",
    });
  }
};


const loginController = async (req, res) => {
  try {
    const data = await userServices.login(req.body);

    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error?.message,
    });
  }
};

const sendOTPController = async (req, res) => {
  try {
    const { recoveryEmail } = req.body;
    const data = await userServices.sendOTP(recoveryEmail);
    
    return res.status(data.statusCode || 200).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message || "An error occurred while sending OTP.",
    });
  }
};

const resetPasswordController = async (req, res) => {
  const payload = req.body;

  try {
    const data = await userServices.resetPassword(payload);
    return res.status(data.statusCode || 200).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message || "An error occurred during password reset.",
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const data = await userServices.updateProfile(req.body);

    return res.status(data.statusCode || 200).json(data);
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      message: error.message || "An error occurred during profile update.",
    });
  }
};


module.exports = {
  signUpController,
  loginController,
  sendOTPController,
  resetPasswordController,
  updateProfileController
};

