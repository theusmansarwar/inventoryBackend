const License = require("../Models/LicenseModel");


// ✅ Add License
// const addLicense = async (req, res) => {
//     try {
//         const { productName, licenseKey, expiryDate, assignedTo } = req.body;

//         const license = new License({
//             productName,
//             licenseKey,
//             expiryDate,
//             assignedTo
//         });

//         await license.save();

//         return res.json({
//             status: 201,
//             message: "License Added Successfully",
//             data: license
//         });
//     } catch (error) {
//         return res.json({
//             status: 500,
//             message: "Error Adding License",
//             error: error.message
//         });
//     }
// };
// ✅ Create License
const addLicense = async (req, res) => {
  try {
    const { productName, licenseKey, expiryDate, assignedTo, status, isPublished } = req.body;

    const missingFields = [];

    // 🔍 Validate required fields only if publishing
   
      if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
      if (!licenseKey) missingFields.push({ name: "licenseKey", message: "License Key is required" });
      if (!expiryDate) missingFields.push({ name: "expiryDate", message: "Expiry Date is required" });
      if (!assignedTo) missingFields.push({ name: "assignedTo", message: "Assigned To is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
    

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const license = new License({
      productName,
      licenseKey,
      expiryDate,
      assignedTo,
      status,
      isPublished,
    });

    await license.save();

    return res.status(201).json({
      status: 201,
      message: "License created successfully",
      data: license,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Licenses (with search + pagination)
const getAllLicenses = async (req, res) => {
    try {
        let { page = 1, limit = 10, keyword = "" } = req.query;

        const filter = keyword
            ? { productName: { $regex: keyword, $options: "i" } }
            : {};

        const licenses = await License.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await License.countDocuments(filter);

        return res.json({
            status: 200,
            message: "Licenses Fetched Successfully",
            data: licenses,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Fetching Licenses",
            error: error.message
        });
    }
};

// ✅ Update License
// const updateLicense = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updated = await License.findByIdAndUpdate(id, req.body, { new: true });

//         if (!updated) {
//             return res.json({
//                 status: 404,
//                 message: "License Not Found"
//             });
//         }

//         return res.json({
//             status: 200,
//             message: "License Updated Successfully",
//             data: updated
//         });
//     } catch (error) {
//         return res.json({
//             status: 500,
//             message: "Error Updating License",
//             error: error.message
//         });
//     }
// };
// ✅ Update License
const updateLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, licenseKey, expiryDate, assignedTo, status, isPublished } = req.body;

    const missingFields = [];


      if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
      if (!licenseKey) missingFields.push({ name: "licenseKey", message: "License Key is required" });
      if (!expiryDate) missingFields.push({ name: "expiryDate", message: "Expiry Date is required" });
      if (!assignedTo) missingFields.push({ name: "assignedTo", message: "Assigned To is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });


    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const updatedLicense = await License.findByIdAndUpdate(
      id,
      { productName, licenseKey, expiryDate, assignedTo, status, isPublished },
      { new: true }
    );

    if (!updatedLicense) {
      return res.status(404).json({ status: 404, message: "License not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "License updated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Delete License (Single)
const deleteLicense = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await License.findByIdAndDelete(id);

        if (!deleted) {
            return res.json({
                status: 404,
                message: "License Not Found"
            });
        }

        return res.json({
            status: 200,
            message: "License Deleted Successfully"
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Deleting License",
            error: error.message
        });
    }
};

// ✅ Delete Multiple Licenses
const deleteMultipleLicenses = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.json({
                status: 400,
                message: "No License IDs Provided"
            });
        }

        const result = await License.deleteMany({ _id: { $in: ids } });

        return res.json({
            status: 200,
            message: `${result.deletedCount} Licenses Deleted Successfully`
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Deleting Licenses",
            error: error.message
        });
    }
};

module.exports = {addLicense, getAllLicenses, updateLicense, deleteLicense, deleteMultipleLicenses}