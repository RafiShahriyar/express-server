// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const { getOrderHistory } = require("../controller/order.controller");
// const { protect } = require("../middleware/authMiddleware");

router.get("/:userId", getOrderHistory);

module.exports = router;
