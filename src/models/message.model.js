const mongoose = require('mongoose');
const messageModel = new mongoose.Schema(
    { 
    senderId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true},

    receiverId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true},

    content: { type: String, required: true,
        trim: true},

    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: false
    }
    }, 
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('Message', messageModel);