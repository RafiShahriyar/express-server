const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({ message: "Authentication failed." });
    }

    if (user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user; // Set the user to request object
    next();
  } catch (error) {
    console.error("Error in admin authorization:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = requireAdmin;
