const express = require("express");
const router = express.Router();

//Importing the authvalidation functions for login and register
const {
  registerValidation,
  loginValidation,
  upload,
} = require("../middleware/authvalidation.middleware");
//Importing functions from auth controller
const {
  login,
  register,
  forgetPassword,
  resetPassword,
  userProfile,
  users,
  uploadImage,
} = require("../controller/auth.controller");
//Importing the JWT verifyer from auth middleware
const verifyToken = require("../middleware/auth.middleware");

//Register route with register validation
router.post("/register", registerValidation, register);
//Login route with register validation
router.post("/login", loginValidation, login);
//Forget Password
router.post("/forgot-password", forgetPassword);
// Reset Password
router.post("/reset-password", resetPassword);

//Profile route with register validation
router.get("/profile/:id", verifyToken, userProfile);
//all users route with
router.get("/users", verifyToken, users);

//Upload image route
router.post("/upload-image", upload.single("profileImage"), uploadImage);

module.exports = router;
