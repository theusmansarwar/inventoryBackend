
const mongoose = require("mongoose");
const AssetLocation = require("../Models/AssetLocationModel");


//  Create Asset Location
// const createAssetLocation = async (req, res) => {
//   try {
//     const { assetId, assetName, branch, floor, room, assignedTo, status } = req.body;

//     const asset = await AssetLocation.create({
//       assetId,
//       assetName,
//       branch,
//       floor,
//       room,
//       assignedTo,
//       status,
//     });

//     res.status(201).json({
//       message: "Asset Location created successfully",
//       data: asset,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// ✅ Asset Create
// ✅ Create Asset Location
const createAssetLocation = async (req, res) => {
  try {
    const {
      assetName,
      branch,
      floor,
      room,
      assignedTo,
      status,
      // isPublished
    } = req.body;

    const missingFields = [];
    if (!assetName) missingFields.push({ name: "assetName", message: "Asset Name is required" });
    if (!branch) missingFields.push({ name: "branch", message: "Branch is required" });
    if (!floor) missingFields.push({ name: "floor", message: "Floor is required" });
    if (!room) missingFields.push({ name: "room", message: "Room is required" });
    if (!assignedTo) missingFields.push({ name: "assignedTo", message: "Assigned To is required" });
    if (!status) missingFields.push({ name: "status", message: "Status is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    // ✅ Generate unique locationId like "loc-0001"
    const lastLocation = await AssetLocation.findOne().sort({ createdAt: -1 });

    let newIdNumber = 1;
    if (lastLocation && lastLocation.locationId) {
      const lastNumber = parseInt(lastLocation.locationId.split("-")[1]);
      newIdNumber = lastNumber + 1;
    }

    const locationId = `loc-${newIdNumber.toString().padStart(4, "0")}`;

    // ✅ Create new Asset Location with generated ID
    const assetLocation = new AssetLocation({
      locationId,
      assetName,
      branch,
      floor,
      room,
      assignedTo,
      status,
      // isPublished,
    });

    await assetLocation.save();

    return res.status(201).json({
      status: 201,
      message: "Asset Location created successfully",
      data: assetLocation,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating Asset Location",
      details: error.message,
    });
  }
};


//  List Asset Locations (with Search + Pagination)
const listAssetLocations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { assetName: { $regex: keyword, $options: "i" } },
        { branch: { $regex: keyword, $options: "i" } },
        { floor: { $regex: keyword, $options: "i" } },
        { room: { $regex: keyword, $options: "i" } },
        { assignedTo: { $regex: keyword, $options: "i" } },
        { status: { $regex: keyword, $options: "i" } },
      ],
    };

    const total = await AssetLocation.countDocuments(query);
    const assets = await AssetLocation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      totalAssetLocations: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      assets,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ Update Asset Location
const updateAssetLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      assetName,
      branch,
      floor,
      room,
      assignedTo,
      status,
      isPublished
    } = req.body;

    const missingFields = [];
      if (!assetName) missingFields.push({ name: "assetName", message: "Asset Name is required" });
      if (!branch) missingFields.push({ name: "branch", message: "Branch is required" });
      if (!floor) missingFields.push({ name: "floor", message: "Floor is required" });
      if (!room) missingFields.push({ name: "room", message: "Room is required" });
      if (!assignedTo) missingFields.push({ name: "assignedTo", message: "Assigned To is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
    

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const updatedAssetLocation = await AssetLocation.findByIdAndUpdate(
      id,
      {
        assetName,
        branch,
        floor,
        room,
        assignedTo,
        status,
        isPublished,
      },
      { new: true }
    );

    if (!updatedAssetLocation) {
      return res.status(404).json({ status: 404, message: "Asset Location not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Asset Location updated successfully",
      data: updatedAssetLocation,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Delete Single Asset Location
const deleteAssetLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AssetLocation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Asset Location not found" });
    }

    res.status(200).json({ message: "Asset Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ Multiple Delete
const deleteMultipleAssetLocations = async (req, res) => {
  try {
    let { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Please provide an array of IDs" });
    }

    ids = ids.map((id) => new mongoose.Types.ObjectId(id));

    const result = await AssetLocation.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      status: 200,
      message: `${result.deletedCount} asset location(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createAssetLocation, listAssetLocations, updateAssetLocation, deleteAssetLocation, deleteMultipleAssetLocations}