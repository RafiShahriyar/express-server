const Order = require("../models/order.model");

// Controller to fetch order history by userId
exports.getOrderHistory = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    const orders = await Order.find({ userId }).populate(
      "products.productId",
      "product category price"
    ); // Populating only necessary fields from the ProductDetails model

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.json(orders);
  } catch (error) {
    console.error("Failed to retrieve order history:", error);
    res.status(500).json({ message: "Error fetching order history" });
  }
};

// Controller to fetch order history by userId for sellers
exports.getSellerHistory = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    const orders = await Order.find({ userId }).populate({
      path: "products.productId",
      model: "ProductDetails",
      populate: {
        path: "uploadedBy",
        model: "User",
      },
    });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.json(orders);
  } catch (error) {
    console.error("Failed to retrieve seller order history:", error);
    res.status(500).json({ message: "Error fetching seller order history" });
  }
};

// Exporting both functions
module.exports = {
  getOrderHistory: exports.getOrderHistory,
  getSellerHistory: exports.getSellerHistory,
};
