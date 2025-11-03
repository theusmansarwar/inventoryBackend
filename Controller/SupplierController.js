const Supplier = require("../Models/SupplierModel");

// ✅ Create Supplier
const createSupplier = async (req, res) => {
  try {
    const { name, contact, email, address, status } = req.body;
    const missingFields = [];

    // ✅ Validate required fields
    if (!name) missingFields.push({ name: "name", message: "Name is required" });
    if (!contact) missingFields.push({ name: "contact", message: "Contact is required" });
    if (!email) missingFields.push({ name: "email", message: "Email is required" });
    if (!address) missingFields.push({ name: "address", message: "Address is required" });
    if (status === undefined || status === null)
      missingFields.push({ name: "status", message: "Status is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
        missingFields: [{ name: "email", message: "Invalid email format" }],
      });
    }

    // ✅ Check for duplicate email
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({
        status: 400,
        message: "This email already exists",
        missingFields: [{ name: "email", message: "This email already exists" }],
      });
    }

    // ✅ Generate supplierId (like sup-0001)
    const lastSupplier = await Supplier.findOne().sort({ createdAt: -1 });
    let newIdNumber = 1;
    if (lastSupplier && lastSupplier.supplierId) {
      const lastNumber = parseInt(lastSupplier.supplierId.split("-")[1]);
      newIdNumber = lastNumber + 1;
    }
    const supplierId = `sup-${newIdNumber.toString().padStart(4, "0")}`;

    // ✅ Create supplier
    const supplier = new Supplier({
      supplierId,
      name,
      contact,
      email,
      address,
      status,
    });

    await supplier.save();

    return res.status(201).json({
      status: 201,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating supplier",
      details: error.message,
    });
  }
};

// ✅ Update Supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, address, status } = req.body;

    const missingFields = [];

    if (!name) missingFields.push({ name: "name", message: "Name is required" });
    if (!contact) missingFields.push({ name: "contact", message: "Contact is required" });
    if (!email) missingFields.push({ name: "email", message: "Email is required" });
    if (!address) missingFields.push({ name: "address", message: "Address is required" });
    if (status === undefined || status === null)
      missingFields.push({ name: "status", message: "Status is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
        missingFields: [{ name: "email", message: "Invalid email format" }],
      });
    }

    // ✅ Duplicate email check (exclude current supplier)
    const existingSupplier = await Supplier.findOne({ email, _id: { $ne: id } });
    if (existingSupplier) {
      return res.status(400).json({
        status: 400,
        message: "This email already exists",
        missingFields: [{ name: "email", message: "This email already exists" }],
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { name, contact, email, address, status },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        status: 404,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    console.error("❌ Error updating supplier:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while updating supplier",
      details: error.message,
    });
  }
};

// ✅ Delete Supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ status: 404, message: "Supplier not found" });
    }
    res.status(200).json({ status: 200, message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// ✅ List Suppliers
const listSuppliers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const keyword = (req.query.keyword || "").trim();

    let filter = {};
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter = {
        $or: [
          { name: { $regex: regex } },
          { contact: { $regex: regex } },
          { email: { $regex: regex } },
          { address: { $regex: regex } },
        ],
      };
    }

    const totalSuppliers = await Supplier.countDocuments(filter);
    const suppliers = await Supplier.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      status: 200,
      totalSuppliers,
      totalPages: Math.ceil(totalSuppliers / limit),
      currentPage: page,
      suppliers,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// ✅ Delete Multiple
const deleteMultipleSuppliers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Please provide an array of supplier IDs",
      });
    }
    const result = await Supplier.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      status: 200,
      message: `${result.deletedCount} supplier(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  createSupplier,
  listSuppliers,
  updateSupplier,
  deleteSupplier,
  deleteMultipleSuppliers,
};
