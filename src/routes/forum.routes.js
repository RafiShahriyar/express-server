const express = require("express");
const router = express.Router();

// Importing the forum controller functions
const { createForum, getForums, deleteForum } = require("../controller/forum.controller");

// Forum Routes
router.post("/forum", createForum); // Endpoint for creating a forum post or reply
router.get("/get-forums", getForums); // Endpoint for getting all forum posts
router.delete("/forum/:id", deleteForum); // Endpoint for deleting a forum post

module.exports = router;