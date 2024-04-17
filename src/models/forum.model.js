const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    userName: {
        type: String,
        // required: true
    },
    userID: {
        type: String,
        // required: true
    },
    comments: {
        type: String,
        required: true
    }
});

const forumSchema = new mongoose.Schema({
    userName: {
        type: String,
        // required: true
    },
    userID: {
        type: String,
        // required: true
    },
    comments: {
        type: String,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId, // Unique parent ID for comments and replies
        default: null
    },
    replies: [this] // Array of replies, each being a forumSchema
});

module.exports = mongoose.model('forum', forumSchema);