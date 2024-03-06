const validator = require("../utils/validate");

const registerValidation = async (req, res, next) => {
  const validateRule = {
    fullName: "required|string|min:3",
    email: "required|email",
    password: "required|min:6",
    phoneNumber: "required|max:14|min:11",
    // 3 type user
    userType: "required|string|in:admin,seller,customer",
  };

  await validator(req.body, validateRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const loginValidation = async (req, res, next) => {
  const validateRule = {
    email: "required|email",
    password: "required|min:6",
  };

  await validator(req.body, validateRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

module.exports = {
  registerValidation,
  loginValidation,
};
