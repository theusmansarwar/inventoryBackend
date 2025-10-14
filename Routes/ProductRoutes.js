const express = require("express");
const { createProduct, listProducts, updateProduct, deleteProduct, deleteMultipleProducts, searchProduct } = require("../Controller/ProductController");

const router=express.Router();
router.post("/create", createProduct);
router.get("/list", listProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.delete("/multipleDelete", deleteMultipleProducts);

module.exports=router;