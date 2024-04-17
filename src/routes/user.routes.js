const express = require("express");
const router = express.Router();

const protectRoute = require("../middleware/auth.middleware");
// const requireAdmin = require("../middleware/admin.middleware");
const { fetchUsers, fetchAllUsers } = require("../controller/user.controller");

router.get("/", protectRoute, fetchUsers);

// router.get("/get-user", fetchAllUsers);

module.exports = router;
