const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const Forum = require("../models/forum.model");

// Create forum post or reply
const createForum = async (req, res) => {
  try {
    const { userName, userID, comments, parentForumId } = req.body;
    console.log(userName);
    console.log(comments);
    console.log(userID);
    if (!userName || !userID || !comments) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    if (parentForumId) {
      // If parentForumId exists, it means it's a reply
      const parentForum = await Forum.findById(parentForumId);
      if (!parentForum) {
        return res.status(404).json({ success: false, error: "Parent forum not found" });
      }
      console.log(parentForumId)
      // Add the reply to the parent forum's replies
      const newReply = { userName, userID, comments };
      if (!parentForum.replies) {
        parentForum.replies = [];
      }
      parentForum.replies.push(newReply);
      await parentForum.save();

      res.status(201).json({ success: true, message: "Reply added successfully" });
    } else {
      // If parentForumId doesn't exist, it means it's a new forum post
      const newForum = new Forum({
        userName,
        comments,
        userID,
        replies: [] // Initialize replies as an empty array
      });

      await newForum.save();

      res.status(201).json({ success: true, message: "Forum post added successfully" });
    }
  } catch (error) {
    console.error("Error adding forum post/reply:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get all forum posts
const getForums = async (req, res) => {
  try {
    const forums = await Forum.find({}, '-_id userName comments replies');
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: "Error fetching forum posts" });
  }
};

// Delete forum post
const deleteForum = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the forum post and its replies recursively
    await Forum.deleteMany({ $or: [{ _id: id }, { "replies.parentForumId": id }] });
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: error });
  }
};

module.exports = {
  createForum,
  getForums,
  deleteForum,
};


