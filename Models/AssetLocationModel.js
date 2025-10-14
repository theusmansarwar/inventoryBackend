const mongoose = require("mongoose");

const assetLocationSchema = new mongoose.Schema(
  {
  
    assetName: {
      type: String,
     
    },
    branch: {
      type: String,
   
    },
    floor: {
      type: String,
    
    },
    room: {
      type: String,
   
    },
    assignedTo: {
      type: String,
    
    },
    status: {
      type: String,
      default: "Available",
    },
  },
  { timestamps: true }
);

const AssetLocation = mongoose.model("AssetLocation", assetLocationSchema);
module.exports = AssetLocation;
