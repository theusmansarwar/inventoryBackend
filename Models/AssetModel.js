const mongoose = require("mongoose");


const assetAssignmentSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    assignmentId:{
       type: String,
      unique: true,
    },
    employeeName:{
        type: String,
        required: true,
        trim: true
    },
    employeeId: {
        type: String,
        required: true
    },
    assignDate: {
        type: Date,
        default: Date.now
    },
    condition: {
        type: String,
        // enum: ["New", "Used", "Damaged"],
        default: "New"
    },
    status: {
        type: String,
        // enum: ["Assigned", "Returned", "Lost"],
        default: "Assigned"
    }
}, { timestamps: true });

const  Asset= mongoose.model("AssetAssignment", assetAssignmentSchema);
module.exports = Asset