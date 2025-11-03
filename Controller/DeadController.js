
const mongoose = require("mongoose");
const DeadProduct = require("../Models/DeadModel");

//  Create Dead Product
// const createDeadProduct = async (req, res) => {
//   try {
//     const { deadProductId, productName, reason, status } = req.body;

//     const product = await DeadProduct.create({
//       deadProductId,
//       productName,
//       reason,
//       status,
//     });

//     res.status(201).json({
//       message: "Dead Product created successfully",
//       data: product,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// ✅ Create Dead Product
const createDeadProduct = async (req, res) => {
  try {
    const { productName, reason, status } = req.body;

    const missingFields = [];

    // 🔍 Validate only if publishing
  
     
      if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
      if (!reason) missingFields.push({ name: "reason", message: "Reason is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
    

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const deadProduct = new DeadProduct({
      productName,
      reason,
      status
    });

    await deadProduct.save();

    return res.status(201).json({
      status: 201,
      message: "Dead Product created successfully",
      data: deadProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//  List Dead Products with Search + Pagination
const listDeadProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { productName: { $regex: keyword, $options: "i" } },
        { reason: { $regex: keyword, $options: "i" } },
        { status: { $regex: keyword, $options: "i" } },
      ],
    };

    const total = await DeadProduct.countDocuments(query);
    const deadProducts = await DeadProduct.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      totalDeadProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      deadProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Dead Product
const updateDeadProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, reason, status } = req.body;

    const missingFields = [];

   
     
      if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
      if (!reason) missingFields.push({ name: "reason", message: "Reason is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
    

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const updatedDeadProduct = await DeadProduct.findByIdAndUpdate(
      id,
      {  productName, reason, status },
      { new: true }
    );

    if (!updatedDeadProduct) {
      return res.status(404).json({ status: 404, message: "Dead Product not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Dead Product updated successfully",
      data: updatedDeadProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Single Dead Product
const deleteDeadProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeadProduct.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Dead Product not found" });
    }

    res.status(200).json({ message: "Dead Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Multiple Delete
const deleteMultipleDeadProducts = async (req, res) => {
  try {
    let { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json
      ({
        status:200,
         message: "Please provide an array of IDs" });
    }

    ids = ids.map((id) => new mongoose.Types.ObjectId(id));

    const result = await DeadProduct.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: 200,
      message: `${result.deletedCount} dead product(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={createDeadProduct,listDeadProducts, updateDeadProduct, deleteDeadProduct ,deleteMultipleDeadProducts}