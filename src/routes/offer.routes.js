const express = require("express");
const router = express.Router();

const protectRoute = require("../middleware/auth.middleware");

const { makeOffer,  getOffers,  declineOffer, acceptOffer } = require("../controller/offer.controller");


router.post("/make-offer/:productId", protectRoute, makeOffer);

router.get("/get-offers/:selectedUserId", protectRoute, getOffers);

router.put("/decline-offer/:offerId", protectRoute, declineOffer);

router.put("/accept-offer/:offerId", protectRoute, acceptOffer);

// router.put("/update-offer/:offerId", protectRoute, updateOffer);

// router.delete("/delete-offer/:offerId", protectRoute, deleteOffer);

module.exports = router;

