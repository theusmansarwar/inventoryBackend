const express=require("express");
const { addLicense, getAllLicenses, updateLicense, deleteLicense, deleteMultipleLicenses } = require("../Controller/LicenseController");
const router=express.Router();

router.post("/create", addLicense);
router.get("/list", getAllLicenses);
router.put("/update/:id", updateLicense);
router.delete("/delete/:id", deleteLicense);
router.delete("/deleteMultiple", deleteMultipleLicenses);
module.exports = router;