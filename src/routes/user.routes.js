const express = require("express");
const router = express.Router();

const protectRoute = require("../middleware/auth.middleware");
const { fetchUsers } = require("../controller/user.controller");

router.get("/", protectRoute, fetchUsers);

module.exports = router;