const { check, validationResult } = require("express-validator");

function userValidation(req, res, next) {
  const validationChecks = [
  check('firstName')
    .notEmpty().withMessage('First name is required')
    .isAlpha().withMessage('First name must contain only alphabetic characters'),
  
  check('lastName')
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name must contain only alphabetic characters'),


  check("email")
      .notEmpty().withMessage("Conatct Email is required")
      .isEmail().withMessage("Invalid email format"),

  // check('location')
  //     .notEmpty().withMessage('location is required')
  //     .isAlpha().withMessage('location must contain only alphabetic characters'),

  // check('gender')
  //     .notEmpty().withMessage('gender is required')
  //     .isAlpha().withMessage('gender must contain only alphabetic characters'),

  // check('phoneNumber')
  //     .notEmpty().withMessage('phoneNumber is required')
  //     .isNumeric().withMessage('phoneNumber must contain only numbers'),
  
  check("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*]/)
      .withMessage('Password must contain at least one special character'),
  
 
  ];

  Promise.all(validationChecks.map((checkFn) => checkFn.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      next();
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = userValidation