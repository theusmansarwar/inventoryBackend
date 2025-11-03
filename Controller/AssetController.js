const mongoose = require("mongoose");
const Asset = require("../Models/AssetModel");


// ✅ Add Assignment
// const addAssignment = async (req, res) => {
//     try {
//         const { productName, employeeName, employeeId, assignDate, condition, status } = req.body;

//         const assignment = new Asset({
//             productName,
//             employeeName,
//             employeeId,
//             assignDate,
//             condition,
//             status
//         });

//         await assignment.save();

//         return res.json({
//             status: 200,
//             message: "Asset Assigned Successfully",
//             data: assignment
//         });
//     } catch (error) {
//         return res.json({
//             status: 500,
//             message: "Error Assigning Asset",
//             error: error.message
//         });
//     }
// };
// ✅ Create Asset Assignment
const addAssignment = async (req, res) => {
  try {
    const { productName, employeeName, employeeId, assignDate, condition, status } = req.body;

    const missingFields = [];

    if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
    if (!employeeName) missingFields.push({ name: "employeeName", message: "Employee Name is required" });
    if (!employeeId) missingFields.push({ name: "employeeId", message: "Employee ID is required" });
    if (!assignDate) missingFields.push({ name: "assignDate", message: "Assign Date is required" });
    if (!condition) missingFields.push({ name: "condition", message: "Condition is required" });
    if (!status) missingFields.push({ name: "status", message: "Status is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    // ✅ Get the last added asset to generate the next locationId
    const lastAssignment = await Asset.findOne().sort({ _id: -1 });
    let newAssetId = "ast-0001"; // Default for first record

    if (lastAssignment && lastAssignment.assignmentId) {
      const lastNumber = parseInt(lastAssignment.assignmentId.split("-")[1]);
      const nextNumber = lastNumber + 1;
      newAssetId = `ast-${String(nextNumber).padStart(4, "0")}`;
    }

    const assignment = new Asset({
      productName,
      employeeName,
      employeeId,
      assignDate,
      condition,
      status,
      assignmentId: newAssetId  // ✅ auto-generated field
    });

    await assignment.save();

    return res.status(201).json({
      status: 201,
      message: "Asset Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating assignment",
      details: error.message,
    });
  }
};


// ✅ Get All Assignments (with Pagination + Search)
const getAllAssignments = async (req, res) => {
    try {
        let { page, limit, keyword } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;

        let filter = {};
        if (keyword) {
            filter = {
                $or: [
                    { productName: { $regex: keyword, $options: "i" } },
                    { employeeName: { $regex: keyword, $options: "i" } },
                    { employeeId: { $regex: keyword, $options: "i" } }
                ]
            };
        }

        const total = await Asset.countDocuments(filter);
        const assignments = await Asset.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.json({
            status: 200,
            message: "Assignments Fetched Successfully",
            totalRecords: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            data: assignments
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Fetching Assignments",
            error: error.message
        });
    }
};


//  Update Asset Assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, employeeName, employeeId, assignDate, condition, status } = req.body;

    const missingFields = [];

    if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
    if (!employeeName) missingFields.push({ name: "employeeName", message: "Employee Name is required" });
    if (!employeeId) missingFields.push({ name: "employeeId", message: "Employee ID is required" });
    if (!assignDate) missingFields.push({ name: "assignDate", message: "Assign Date is required" });
    if (!condition) missingFields.push({ name: "condition", message: "Condition is required" });
    if (!status) missingFields.push({ name: "status", message: "Status is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

  
    const updatedAssignment = await Asset.findByIdAndUpdate(
      id,
      { productName, employeeName, employeeId, assignDate, condition, status },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ status: 404, message: "Asset Assignment not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Asset Assignment updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// ✅ Delete Single Assignment
const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Asset.findByIdAndDelete(id);

        if (!assignment) {
            return res.json({ status: 404, message: "Assignment Not Found" });
        }

        return res.json({ status: 200, message: "Assignment Deleted Successfully" });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Deleting Assignment",
            error: error.message
        });
    }
};

// ✅ Delete Multiple Assignments
const deleteMultipleAssignments = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) {
            return res.json({ status: 400, message: "No Assignment IDs Provided" });
        }

        const result = await Asset.deleteMany({ _id: { $in: ids } });

        return res.json({
            status: 200,
            message: `${result.deletedCount} Assignments Deleted Successfully`
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Deleting Assignments",
            error: error.message
        });
    }
};
module.exports={addAssignment, getAllAssignments, updateAssignment, deleteAssignment, deleteMultipleAssignments};