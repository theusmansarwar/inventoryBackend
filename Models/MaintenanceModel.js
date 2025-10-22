const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    assetName: {
         type: String, 
         required: true
         },
     maintenanceId:{
     type: String,
      unique: true,    
     },
    issue: {
         type: String, 
         required: true
         },
    reportedDate: {
         type: Date, 
         default: Date.now 
        }, // auto set when created
    resolvedDate: { 
        type: Date
         },
    status: { 
      type: String, 
      enum: ["Pending", "In Progress", "Resolved"], 
      default: "Pending" 
    },
    expense: {
         type: Number, 
         default: 0
         } // in PKR
  },
  { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports= Maintenance