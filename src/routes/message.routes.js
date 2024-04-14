const express = require("express");
const router = express.Router();

const protectRoute = require("../middleware/auth.middleware");

const { sendMessage, getMessages, deleteMessage,  updateMessage} = require("../controller/message.controller");

router.post("/send/:id", protectRoute, sendMessage);

router.get("/:id", protectRoute, getMessages);

router.delete("/delete-message/:id", protectRoute, deleteMessage);

router.put("/update-message/:id", protectRoute, updateMessage);

module.exports = router;