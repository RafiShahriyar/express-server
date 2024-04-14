const User = require("../models/user.model");

const fetchUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const searchTerm = req.query.search;
    let query = { _id: { $ne: loggedInUser } };

    if (searchTerm) {
      query.fullName = { $regex: searchTerm, $options: "i" }; // search in a case-insensitive manner
    }

    const allUsers = await User.find(query).select("-password");

    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

module.exports = { fetchUsers };
