const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    productID: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    postedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);