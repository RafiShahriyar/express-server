const express = require("express");
const router = express.Router();

// Importing the product controller functions
const {
  uploadProduct,
  getProducts,
  deleteProduct,
  createReview,
  getReviews,
  getProductById,
  getProductByUser,
  getProductsByCategory,
} = require("../controller/product.controller");

// importing the product middleware functions
const { checkDuplicateReview } = require("../middleware/product.middleware");
const upload = require("../middleware/uploadFile");

const requireAdminOrSeller = require("../middleware/seller.middleware");

// Upload item route
router.post("/upload-item", upload.single("image"), uploadProduct);

// Get all items route
router.get("/get-item", getProducts);

// Delete item route
router.delete("/delete-item/:id", requireAdminOrSeller, deleteProduct);

// Review ROutes
router.post("/review-product", checkDuplicateReview, createReview);
router.get("/get-review/:productID", getReviews);

// get product by Id
router.get("/get-product/:productID", getProductById);

//get product by uploaded by user
router.get("/get-product-by-user/:userID", getProductByUser);

// get product by category
router.get("/get-productsByCat/:category", getProductsByCategory);

module.exports = router;
