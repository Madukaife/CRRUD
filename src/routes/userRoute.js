

const express = require("express");
const userControllers = require("../controllers/userController");
const userValidation = require("../middlewares/user.validations");
const authmiddleware = require("../middlewares/userAuth")
const router = express.Router();

router.post("/signup", userValidation, userControllers.signUpController);
router.post("/login", userControllers.loginController);
router.post('/recover', userControllers.sendOTPController);
router.post('/reset', userControllers.resetPasswordController);
router.put('/update', userControllers.updateProfileController);





module.exports = router; 