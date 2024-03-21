const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema(
  {
    id: String,
   image:String,
   product:String,
   category:String,
   price:String

  },
  {
    collection: "ProductDetails",
  }
);

module.exports =mongoose.model("ProductDetails", ProductDetailsSchema);