const Review = require('../models/review.model');

const checkDuplicateReview = async (req, res, next) => {
    const { userID, productID } = req.body;

    const existingReview = await Review.findOne({ userID, productID });

    if (existingReview) {
        const errorMessage = "You have already reviewed this product";
        console.log(errorMessage);
        return res.status(400).json({ success: false, error: errorMessage });
    } else {
        next();
    }
};

module.exports = { checkDuplicateReview };
