const Product = require("../Models/ProductModel");

// ✅ Create Product
const createProduct = async (req, res) => {
  try {
    const { productName, category, status, description } = req.body;

    const missingFields = [];

    if (!productName)
      missingFields.push({ name: "productName", message: "Product Name is required" });
    if (!category)
      missingFields.push({ name: "category", message: "Category is required" });
    if (!status)
      missingFields.push({ name: "status", message: "Status is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    // ✅ Generate new productId
    const lastProduct = await Product.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;
    if (lastProduct && lastProduct.productId) {
      const lastIdNumber = parseInt(lastProduct.productId.split("-")[1]);
      nextNumber = lastIdNumber + 1;
    }

    const productId = `pro-${nextNumber.toString().padStart(4, "0")}`;

    const product = new Product({
      productId,
      productName,
      category,
      status,
      description: description || "", // ✅ optional field (empty if not provided)
    });

    await product.save();

    return res.status(201).json({
      status: 201,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating product",
      details: error.message,
    });
  }
};

// ✅ List Products (with pagination & search)
const listProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const keyword = (req.query.keyword || "").trim();
    let filter = {};

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter = {
        $or: [
          { productName: { $regex: regex } },
          { category: { $regex: regex } },
          { description: { $regex: regex } }, // ✅ also searchable
        ],
      };
    }

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, category, status, description } = req.body;

    const missingFields = [];
    if (!productName)
      missingFields.push({ name: "productName", message: "Product Name is required" });
    if (!category)
      missingFields.push({ name: "category", message: "Category is required" });
    if (!status)
      missingFields.push({ name: "status", message: "Status is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, category, status, description: description || "" },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while updating product",
      details: error.message,
    });
  }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Multiple Products
const deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: "Please provide an array of product IDs" });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No products found for deletion" });
    }

    res.status(200).json({
      status: 200,
      message: "Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
};
