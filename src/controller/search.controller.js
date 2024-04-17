const ProductDetails = require("../models/product.model");

exports.searchProducts = async (req, res) => {
  try {
    // Extract the search query parameter
    const { q } = req.query;

    // Build a search query using regex for partial matching and case insensitivity
    const query = {
      $or: [
        { product: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };

    // Find products that match the search query
    const products = await ProductDetails.find(query);

    // Respond with the found products
    res.json(products);
  } catch (error) {
    console.error("Failed to search products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};
