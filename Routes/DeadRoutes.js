const express = require("express");
const { createDeadProduct, listDeadProducts, updateDeadProduct, deleteDeadProduct, deleteMultipleDeadProducts } = require("../Controller/DeadController");
const router = express.Router();

router.post("/create", createDeadProduct);
router.get("/list", listDeadProducts);
router.put("/update/:id", updateDeadProduct);
router.delete("/delete/:id", deleteDeadProduct);
router.delete("/deleteMultiple", deleteMultipleDeadProducts);

module.exports = router;