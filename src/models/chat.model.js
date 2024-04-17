const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: []}],

}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);