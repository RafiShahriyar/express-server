const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema(
  {
    id: String,
    image: String,
    product: String,
    category: String,
    price: String,
    specifications: Object,
    keySpecifications: Object,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    stock: {
      type: Number,
      default: 1,
    },
    },
  {
    collection: "ProductDetails",
  }
);

module.exports = mongoose.model("ProductDetails", ProductDetailsSchema);

