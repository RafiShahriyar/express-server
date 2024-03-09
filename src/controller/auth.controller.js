const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
var nodemailer = require("nodemailer");

// REGISTER //////////////////////////////////////////////
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phoneNumber, userType } = req.body;

  try {
    //Verifying email
    const verifyEmail = await userModel.findOne({ email: email });
    if (verifyEmail) {
      return res.status(403).json({
        message: "Email already used",
      });
    }

    //generating userId
    const userId = uuidv4();
    console.log(userId, "userId");
    //using bcrypt to hash the password sent from the user
    const hash = await bcrypt.hash(password, 10);

    //Registering the user
    const user = new userModel({
      userId: userId,
      fullName: fullName,
      email: email,
      password: hash,
      phoneNumber: phoneNumber,
      userType: userType,
    });

    //saving the data to the mongodb user collection
    const response = await user.save();

    return res.status(201).json({
      message: "user successfully created!",
      result: response,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

//////////////////////////////////////////////

// LOGIN //////////////////////////////////////////////
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //created a variable to assign the user
  let getUser;

  //verifying that the user with the email exist or not
  userModel
    .findOne({
      email: email,
    })
    .then((user) => {
      if (!user) {
        //if user does not exist responding Authentication Failed
        return res.status(401).json({
          message: "Authentication Failed",
        });
      }
      //assigned the user to getUser variable
      getUser = user;
      /*
    Then compare the password from the req.body and the hashed password on the database 
    using the bcrypt.compare built in function
    */
      return bcrypt.compare(password, user.password);
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: "Authentication Failed",
        });
      } else {
        let jwtToken = jwt.sign(
          {
            email: getUser.email,
            userId: getUser.userId,
          },
          //Signin the token with the JWT_SECRET in the .env
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          accessToken: jwtToken,
          userId: getUser.userId,
          userType: getUser.userType,
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        message: err.message,
        success: false,
      });
    });
});

// USER PROFILE //////////////////////////////////////////////
const userProfile = asyncHandler(async (req, res, next) => {
  //Destructing id from the req.params
  const { id } = req.params;

  try {
    //verifying if the user exist in the database
    const verifyUser = await userModel.findOne({ userId: id });
    if (!verifyUser) {
      return res.status(403).json({
        message: "user not found",
        success: false,
      });
    } else {
      return res.status(200).json({
        messgae: `user ${verifyUser.fullName}`,
        success: true,
      });
    }
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

const users = asyncHandler(async (req, res) => {
  //Fetching all users from database
  try {
    const users = await userModel.find();
    console.log(users);
    return res.status(200).json({
      data: users,
      sucess: true,
      message: "users list",
    });
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      message: error.message,
    });
  }
});

// Forget Password //////////////////////////////////////////////
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    //Verifying email
    const verifyEmail = await userModel.findOne({ email: email });
    if (!verifyEmail) {
      return res.status(403).json({
        message: "Email not found",
      });
    } else {
      // Create json web token and send reset password link including web token
      let jwtToken = jwt.sign(
        {
          email: verifyEmail.email,
          userId: verifyEmail.userId,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      // Send reset password link to user email
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Password",
        html: `<h2>Please click on given link to reset your password</h2>
                <p>${process.env.CLIENT_URL}/resetpassword/${jwtToken}</p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        } else {
          return res.status(200).json({
            message: "Reset password link sent to your email",
            token: jwtToken,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Reset Password //////////////////////////////////////////////

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hash;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Upload Image //////////////////////////////////////////////
const uploadImage = asyncHandler(async (req, res) => {
  // Check if user exists
  const user = await userModel.findOne({ userId: req.params.userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    // Check if there is a file in the request
    if (!req.files) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save the file path to the user document
    user.profileImage = req.files.path;
    await user.save();

    return res.status(200).json({
      message: "Image uploaded successfully",
      imagePath: req.files.path,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword,
  userProfile,
  users,
  uploadImage,
};
