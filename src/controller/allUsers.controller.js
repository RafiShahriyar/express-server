const User = require("../models/user.model");

const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = { fetchAllUsers };
