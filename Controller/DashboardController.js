const Role = require("../Models/RoleModel");
const User = require("../Models/UserModel");
const Supplier = require("../Models/SupplierModel");
const Product = require("../Models/ProductModel");
const Stock = require("../Models/StockModel");
const Asset = require("../Models/AssetModel");
const Maintenance = require("../Models/MaintenanceModel");
const DeadProduct = require("../Models/DeadModel");
const AssetLocation = require("../Models/AssetLocationModel");

const getDashboardData = async (req, res) => {
  try {
    const totalRoles = await Role.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalStock = await Stock.countDocuments();
    const totalAssets = await Asset.countDocuments();
    const totalMaintenance = await Maintenance.countDocuments();
    const totalDeadProducts = await DeadProduct.countDocuments();
    const totalAssetLocations = await AssetLocation.countDocuments();

    return res.status(200).json({
      totalRoles,
      totalUsers,
      totalSuppliers,
      totalProducts,
      totalStock,
      totalAssets,
      totalMaintenance,
      totalDeadProducts,
      totalAssetLocations,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

module.exports = { getDashboardData };
