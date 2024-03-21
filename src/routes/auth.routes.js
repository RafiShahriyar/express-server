const express = require("express");
const router = express.Router();

//Importing the authvalidation functions for login and register
const {
  registerValidation,
  loginValidation,
} = require("../middleware/authvalidation.middleware");
//Importing functions from auth controller
const {
  login,
  register,
  forgetPassword,
  userProfile,
  users,
  resetpassword,
  resendVerification,
  verifyUser,
} = require("../controller/auth.controller");
//Importing the JWT verifyer from auth middleware

const { uploadProduct, getProducts, deleteProduct, } = require("../controller/product.controller");
const upload = require("../middleware/uploadFile");

const verifyToken = require("../middleware/auth.middleware");

//Register route with register validation
router.post("/register", registerValidation, register);
//Login route with register validation
router.post("/login", loginValidation, login);
//Forget Password
router.post("/forgot-password", forgetPassword);

//Profile route with register validation
router.get("/profile/:id", verifyToken, userProfile);
//all users route with
router.get("/users", verifyToken, users);
//Reset Password
router.post("/reset-password/:token", resetpassword);
//Resend Verification
router.post("/resend-verification", resendVerification);
//Verify User
router.post("/verify-user/:token", verifyUser);

//Upload item route
router.post("/upload-item", upload.single("image"), uploadProduct);


// Get all items route
router.get("/get-item", getProducts);

// Delete item route
router.delete("/delete-item/:id", deleteProduct);

module.exports = router;
