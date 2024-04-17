const express = require("express");
const router = express.Router();
const requireAdmin = require("../middleware/admin.middleware");
const { fetchAllUsers } = require("../controller/allUsers.controller");

router.get("/get-users", fetchAllUsers);

module.exports = router;
