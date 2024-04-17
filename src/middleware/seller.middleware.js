const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const requireAdminOrSeller = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.userId }).select(
      "-password"
    );

    console.log(decoded);
    console.log(user.userType);

    if (!user) {
      return res.status(401).json({ message: "Authentication failed." });
    }

    // Check if the user is an admin or a seller
    if (user.userType !== "admin" && user.userType !== "seller") {
      return res
        .status(403)
        .json({ message: "Access denied. Admins and sellers only." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authorization:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = requireAdminOrSeller;
