const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    productName:{
        type: String,
        required: true 
    },
    quantity:{
        type: Number, 
        required: true
    },
    unitPrice:{
        type: Number, 
        required: true
    },
    totalPrice:{
        type: Number, 
        required: true
     },
    supplierName:{
         type: String, 
         required: true 
    },
    currentDate:{
        type: Date,
        default: Date.now 
    },
    warrantyDate:{ 
    type: Date 
    }
  },
  { timestamps: true }
);

const Stock = mongoose.model("Stock", stockSchema);
module.exports= Stock;
