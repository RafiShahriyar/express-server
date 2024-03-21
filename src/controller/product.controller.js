
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

// Import product model 
const Items = require("../models/product.model");

// Upload product info to DB
const uploadProduct = async (req, res) => {
    console.log(req.body);
    const { product, category, price } = req.body;
    const imageName = req.file.filename;
  
    try {
      await Items.create({
        id: uuidv4(),
        image: imageName,
        product: product, 
        category: category, 
        price: price 
       });
      res.json({ status: "ok" });
    } catch (error) {
      res.json({ status: error });
    }
    };

// Get all products
const getProducts = async (req, res) => {
    try {
      const items = await Items.find({}, '-_id id image product category price');
        res.json(items);
      
    } catch (error) {
      res.status(500).json({ error: "Error fetching images" });
    }
  };

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      await Items.deleteOne({ id: id });
      res.json({ status: "ok" });
    } catch (error) {
      res.json({ status: error });
    }
  };


        
module.exports = {
    uploadProduct,
    getProducts,
    deleteProduct};