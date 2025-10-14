const express = require("express");
const { addAssignment, getAllAssignments, updateAssignment, deleteAssignment, deleteMultipleAssignments} = require("../Controller/AssetController");
const router = express.Router();

router.post("/create", addAssignment);
router.get("/list", getAllAssignments);
router.put("/update/:id", updateAssignment);
router.delete("/delete/:id", deleteAssignment);
router.delete("/multipleDelete", deleteMultipleAssignments);
module.exports = router; 