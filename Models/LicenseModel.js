const mongoose = require("mongoose");

const licenseSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    licenseKey: {
        type: String,
        required: true,
        unique: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    assignedTo: {
        type: String, // Employee / Department name
        default: null
    },
    status: {
      type: String,
    },
}, { timestamps: true });

const license = mongoose.model("License", licenseSchema);
module.exports = license
