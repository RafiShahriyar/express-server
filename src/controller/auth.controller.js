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
    const verificationToken = jwt.sign(
      { email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
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
    // Send verification email to user
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
      subject: "Email Verification",
      html: `<h2>Please click on given link to verify your email</h2>
            <p>${process.env.CLIENT_URL}verify-user/${verificationToken}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).json({
          message: error.message,
        });
      } else {
        return res.status(200).json({
          message: "User registered successfully",
          token: verificationToken,
        });
      }
    });

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
// UPDATE USER //////////////////////////////////////////////
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId, "userId");
  console.log(req.body);
  const { userName, phoneNumber } = req.body;
  console.log(userName, phoneNumber, "fullName, phoneNumber");

  try {
    // Check if the user exists
    const existingUser = await userModel.findOne({ userId: userId });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update user data
    existingUser.fullName = userName;
    existingUser.phoneNumber = phoneNumber;

    // Save updated user data to the database
    const updatedUser = await existingUser.save();
    console.log(updatedUser, "updatedUser");
    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
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

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Authentication Failed",
      });
    }

    if (user.verification !== "verified") {
      return res.status(401).json({
        message: "User not verified",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Authentication Failed",
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        userId: user.userId,
        userMId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      accessToken: jwtToken,
      userId: user.userId,
      userType: user.userType,
      userName: user.fullName,
      email: user.email,
      userMId: user._id,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

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
        message: `user ${verifyUser.fullName}`,
        data: verifyUser,
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
                <p>${process.env.CLIENT_URL}reset-password/${jwtToken}</p>`,
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

const resetpassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword, token } = req.body;
  console.log(token);

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const userBeforeUpdate = await userModel.findOne({ email: decoded.email });
    console.log("User before password update:", userBeforeUpdate);

    // Check if newPassword and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Hash new password
    const hash = await bcrypt.hash(password, 10);
    // Update password
    console.log("New hashed password:", hash);
    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { $set: { password: hash } }
    );
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { $set: { verification: "verified" } }
    );
    console.log(user);
    return res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const verifyEmail = await userModel.findOne({ email: email });
    if (!verifyEmail) {
      return res.status(403).json({
        message: "Email not found",
      });
    } else {
      const verificationToken = jwt.sign(
        { email: email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
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
        subject: "Email Verification",
        html: `<h2>Please click on this new given link to verify your email</h2>
                <p>${process.env.CLIENT_URL}verify-user/${verificationToken}</p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        } else {
          return res.status(200).json({
            message: "Verification link sent to your email",
            token: verificationToken,
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

module.exports = {
  register,
  login,
  updateUser,
  forgetPassword,
  userProfile,
  users,
  resetpassword,
  resendVerification,
  verifyUser,
};
