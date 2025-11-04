const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Hardware", "Software", "License"], // only these values allowed
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    description: {
      type: String,
      trim: true,
      default: "", // ✅ optional — if not provided, defaults to empty string
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
