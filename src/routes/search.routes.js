const express = require("express");
const router = express.Router();
const { searchProducts } = require("../controller/search.controller");

// Setup the search route
router.get("/", searchProducts);

module.exports = router;
