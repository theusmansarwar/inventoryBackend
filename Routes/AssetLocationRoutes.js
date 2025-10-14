const express = require("express");
const { createAssetLocation, listAssetLocations, updateAssetLocation, deleteAssetLocation, deleteMultipleAssetLocations } = require("../Controller/AssetLocationController");
const router = express.Router();

router.post("/create", createAssetLocation );
router.get("/list", listAssetLocations);
router.put("/update/:id", updateAssetLocation );
router.delete("/delete/:id", deleteAssetLocation);
router.delete("/deleteMultiple", deleteMultipleAssetLocations);
module.exports=router;