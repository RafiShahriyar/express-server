const User = require("../models/user.model");
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

const fetchUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const searchTerm = req.query.search;
        // let query = { _id: { $ne: loggedInUser }};

        // Fetch all chats that the logged-in user is part of
        const chats = await Chat.find({
            users: {$in: [loggedInUser]}
        });

        // Extract all user IDs from the fetched chats except for the loggin in user id
        let userIds = [];
        console.log("chats", chats);
        chats.forEach(chat => {
            chat.users.forEach(user => {
                if (!userIds.includes(user.toString()) && user.toString() !== loggedInUser.toString()) {
                    userIds.push(user.toString());
                }
            });
        });

        let query = { _id: { $in: userIds }};

        if (searchTerm) {
            query.fullName = { $regex: searchTerm, $options: 'i' }; // search in a case-insensitive manner
        }

        const allUsers = await User.find(query).select("-password");

        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }   
}

module.exports = { fetchUsers };