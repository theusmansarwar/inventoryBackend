const express = require("express");
const { createSupplier, listSuppliers, updateSupplier, deleteSupplier, deleteMultipleSuppliers } = require("../Controller/SupplierController");
const router=express.Router();

//create
router.post("/create", createSupplier);
//list
router.get("/list", listSuppliers);
//update
router.put("/update/:id", updateSupplier);
//delete
router.delete("/delete/:id", deleteSupplier);
//multipleDelete
router.delete("/multipleDelete", deleteMultipleSuppliers);
module.exports = router;