const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },

  userType: {
    type: String,
  },
  verification: {
    type: String,
    default: "not verified",
  },
});

module.exports = mongoose.model("User", userSchema);
