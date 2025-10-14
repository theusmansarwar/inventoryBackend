const express= require("express");
const { createMaintenance, listMaintenance, updateMaintenance, deleteMaintenance, deleteMultipleMaintenance } = require("../Controller/MaintenanceController");
const router=express.Router();

router.post("/create", createMaintenance);
router.get("/list", listMaintenance);
router.put("/update/:id", updateMaintenance);
router.delete("/delete/:id", deleteMaintenance);
router.delete("/deleteMultiple", deleteMultipleMaintenance);
module.exports = router;