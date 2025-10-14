const mongoose = require("mongoose");

const deadProductSchema = new mongoose.Schema(
  {
    deadProductId: {
      type: String,
      required: true,
      unique: true, // unique ID for each dead product
    },
    productName: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "dead",
    },
  },
  { timestamps: true }
);

const DeadProduct = mongoose.model("DeadProduct", deadProductSchema);
module.exports = DeadProduct;
