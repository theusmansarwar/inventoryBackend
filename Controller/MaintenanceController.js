const Maintenance = require("../Models/MaintenanceModel");


// ✅ Create Maintenance Record
// const createMaintenance = async (req, res) => {
//   try {
//     const { assetName, issue, resolvedDate, status, expense } = req.body;

//     const maintenance = new Maintenance({
//       assetName,
//       issue,
//       resolvedDate,
//       status,
//       expense
//     });

//     await maintenance.save();

//     res.status(201).json({
//       status: 201,
//       message: "Maintenance record created successfully",
//       data: maintenance,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// ✅ Create Maintenance
const createMaintenance = async (req, res) => {
  try {
    const { assetName, issue, reportedDate, resolvedDate, status, expense, isPublished } = req.body;

    const missingFields = [];

    // 🔍 Validate required fields
    if (!assetName) missingFields.push({ name: "assetName", message: "Asset Name is required" });
    if (!issue) missingFields.push({ name: "issue", message: "Issue is required" });
    if (!reportedDate) missingFields.push({ name: "reportedDate", message: "Reported Date is required" });
    if (!status) missingFields.push({ name: "status", message: "Status is required" });
    if (!expense) missingFields.push({ name: "expense", message: "Expense is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    // ✅ Generate unique maintenanceId like "mnt-0001"
    const lastMaintenance = await Maintenance.findOne().sort({ createdAt: -1 });

    let newIdNumber = 1; // Default start if no record exists
    if (lastMaintenance && lastMaintenance.maintenanceId) {
      const lastNumber = parseInt(lastMaintenance.maintenanceId.split("-")[1]);
      newIdNumber = lastNumber + 1;
    }

    const maintenanceId = `mnt-${newIdNumber.toString().padStart(4, "0")}`;

    // ✅ Create new maintenance record with generated ID
    const maintenance = new Maintenance({
      maintenanceId,
      assetName,
      issue,
      reportedDate,
      resolvedDate,
      status,
      expense,
      isPublished,
    });

    await maintenance.save();

    return res.status(201).json({
      status: 201,
      message: "Maintenance record created successfully",
      data: maintenance,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating maintenance record",
      details: error.message,
    });
  }
};

// ✅ List + Search + Pagination
const listMaintenance = async (req, res) => {
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};
    if (keyword) {
      query = {
        $or: [
          { assetName: { $regex: keyword, $options: "i" } },
          { issue: { $regex: keyword, $options: "i" } },
          { status: { $regex: keyword, $options: "i" } }
        ]
      };
    }

    const total = await Maintenance.countDocuments(query);

    const maintenance = await Maintenance.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ Update Maintenance
// const updateMaintenance = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await Maintenance.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json({
//       status: 200,
//       message: "Maintenance record updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// ✅ Update Maintenance
const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { assetName, issue, reportedDate, resolvedDate, status, expense, isPublished } = req.body;

    const missingFields = [];

    if (isPublished) {
      if (!assetName) missingFields.push({ name: "assetName", message: "Asset Name is required" });
      if (!issue) missingFields.push({ name: "issue", message: "Issue is required" });
      if (!reportedDate) missingFields.push({ name: "reportedDate", message: "Reported Date is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
      if (!expense) missingFields.push({ name: "expense", message: "Expense is required" });
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id,
      { assetName, issue, reportedDate, resolvedDate, status, expense, isPublished },
      { new: true }
    );

    if (!updatedMaintenance) {
      return res.status(404).json({ status: 404, message: "Maintenance record not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Maintenance record updated successfully",
      data: updatedMaintenance,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Single
const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    await Maintenance.findByIdAndDelete(id);

    res.status(200).json
    ({ message: "Maintenance record deleted" 

    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Multiple Delete
const deleteMultipleMaintenance = async (req, res) => {
  try {
    const { ids } = req.body; // array of IDs

    await Maintenance.deleteMany({ _id: { $in: ids } });

    res.status(200).json
    ({
        status: 200,
         message: "Maintenance records deleted"
    });
  } catch (error) {
    res.status(500).json
    ({
         error: error.message 
    });
  }
};
module.exports={createMaintenance, listMaintenance, updateMaintenance, deleteMaintenance, deleteMultipleMaintenance }