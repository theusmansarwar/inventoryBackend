const mongoose = require("mongoose");

const deadProductSchema = new mongoose.Schema(
  {
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
