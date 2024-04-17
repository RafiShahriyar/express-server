const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

// Import product model
const Items = require("../models/product.model");

// Import review model
const Review = require("../models/review.model");

// Upload product info to DB
// const uploadProduct = async (req, res) => {
//     console.log(req.body);
//     const { product, category, price } = req.body;
//     const imageName = req.file.filename;

//     try {
//       await Items.create({
//         id: uuidv4(),
//         image: imageName,
//         product: product,
//         category: category,
//         price: price
//        });
//       res.json({ status: "ok" });
//     } catch (error) {
//       res.json({ status: error });
//     }
//     };
const uploadProduct = async (req, res) => {
  try {
    const { product, category, price, uploadedBy } = req.body;
    const imageName = req.file.filename;

    // Manually parse specifications from request body
    const specifications = JSON.parse(req.body.specifications);

    // Create a new product
    const newProduct = new Items({
      id: uuidv4(),
      product,
      category,
      price,
      specifications: specifications, // Add specifications to product
      image: imageName,
      uploadedBy,
    });

    // Save the product
    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const items = await Items.find(
      {},
      "_id id image product category price specifications stock"
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error fetching images" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await Items.deleteOne({ id: id });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
};

// Create a review

const createReview = async (req, res) => {
  try {
    const { userName, userID, productID, comments, rating } = req.body;

    if (!userName || !userID || !productID || !comments || !rating) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const newReview = new Review({
      userName,
      userID,
      productID,
      comments,
      rating,
    });

    await newReview.save();

    res
      .status(201)
      .json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get  reviews of product based on id
const getReviews = async (req, res) => {
  try {
    const { productID } = req.params;
    // console.log(`Fetching reviews for product: ${productID}`);
    console.log(productID);

    const reviews = await Review.find({ productID: productID });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
// get product by ID
const getProductById = async (req, res) => {
  try {
    const { productID } = req.params;
    console.log(productID);
    // Find the product and populate the 'uploadedBy' field
    const product = await Items.findOne({ id: productID }).populate(
      "uploadedBy"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get product by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching products for category: ${category}`);

    const products = await Items.find(
      { category: category },
      "-_id id image product category price specifications keySpecifications"
    );
    if (products.length === 0) {
      return res.status(404).json({ error: "Products not found" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductByUser = async (req, res) => {
  try {
    const { userID } = req.params;

    // Find the product and populate the 'uploadedBy' field
    const product = await Items.find({ uploadedBy: userID }).populate(
      "uploadedBy"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  uploadProduct,
  getProducts,
  deleteProduct,
  createReview,
  getReviews,
  getProductById,
  getProductByUser,
  getProductsByCategory,
};
