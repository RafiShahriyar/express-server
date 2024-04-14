const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log("Token:", token); // Log the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({userId : decoded.userId}).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Error verifying token:", err); // Log the error
    return res.status(401).json({
      message: "Authentification Failed",
    });
  }
};

module.exports = protectRoute;