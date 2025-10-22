const Stock = require("../Models/StockModel");


const createStock = async (req, res) => {
  try {
    const { productName, quantity, unitPrice, totalPrice, supplierName, currentDate, warrantyDate } = req.body;

    const missingFields = [];

    if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
    if (!quantity) missingFields.push({ name: "quantity", message: "Quantity is required" });
    if (!unitPrice) missingFields.push({ name: "unitPrice", message: "Unit Price is required" });
    if (!totalPrice) missingFields.push({ name: "totalPrice", message: "Total Price is required" });
    if (!supplierName) missingFields.push({ name: "supplierName", message: "Supplier Name is required" });
    if (!currentDate) missingFields.push({ name: "currentDate", message: "Current Date is required" });
    if (!warrantyDate) missingFields.push({ name: "warrantyDate", message: "Warranty Date is required" });

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    // ✅ Auto-generate Stock ID (STK-0001, STK-0002, ...)
    const lastStock = await Stock.findOne().sort({ createdAt: -1 });
    let newStockID = "STK-0001";

    if (lastStock && lastStock.stockID) {
      const lastNumber = parseInt(lastStock.stockID.split("-")[1]);
      const nextNumber = lastNumber + 1;
      newStockID = `STK-${String(nextNumber).padStart(4, "0")}`;
    }

    const stock = new Stock({
      stockID: newStockID,
      productName,
      quantity,
      unitPrice,
      totalPrice,
      supplierName,
      currentDate,
      warrantyDate,
    });

    await stock.save();

    return res.status(201).json({
      status: 201,
      message: "Stock created successfully",
      data: stock,
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating stock",
      details: error.message,
    });
  }
};
//list with search + pagination
const listStock = async(req,res) => {
    try{
        let{page, limit, keyword} = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;

        //search filter
        let query ={};
        if(keyword){
            query={
                $or: [
                    {productName: {$regex: keyword, $options: "i"} },
                    {supplierName: {$regex: keyword, $options: "i"} },
                ]
            };
        }

        const total = await Stock.countDocuments(query);
        const stock = await Stock.find(query)
        .sort({createdAt:- 1})
        .skip((page - 1) * limit)
        .limit(limit);

        return res.json({
            status: 200,
            message: "Stock Records Fetched Successfully",
            totalRecords: total,
            currentPage: page,
            totalPages: Math.ceil(total/ limit),
            data: stock
        });
    }catch(error){
        return res.json({
            status: 500,
            message:"Error Fetching Stock Records",
            error: error.message
        });
    }
};
//update Stock

// Update Stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, quantity, unitPrice, totalPrice, supplierName, currentDate, warrantyDate } = req.body;

    const missingFields = [];

    // ✅ Validate only if publishing
   
      if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
      if (!quantity) missingFields.push({ name: "quantity", message: "Quantity is required" });
      if (!unitPrice) missingFields.push({ name: "unitPrice", message: "Unit Price is required" });
      if (!totalPrice) missingFields.push({ name: "totalPrice", message: "Total Price is required" });
      if (!supplierName) missingFields.push({ name: "supplierName", message: "Supplier Name is required" });
      if (!currentDate) missingFields.push({ name: "currentDate", message: "Current Date is required" });
      if (!warrantyDate) missingFields.push({ name: "warrantyDate", message: "Warranty Date is required" });
 

    if (missingFields.length > 0) {
      return res.status(400).json({ status: 400, message: "Validation failed", missingFields });
    }

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      { productName, quantity, unitPrice, totalPrice, supplierName, currentDate, warrantyDate, isPublished },
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ status: 404, message: "Stock not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Stock updated successfully",
      data: updatedStock,
    });

  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong while updating Stock",
      details: error.message,
    });
  }
};

//delete Stock
const deleteStock = async (req, res) => {
    try {
        const { id } = req.params;

        const stock = await Stock.findByIdAndDelete(id);

        if (!stock) {
            return res.json({
                status: 404,
                message: "Stock Not Found"
            });
        }

        return res.json({
            status: 200,
            message: "Stock Deleted Successfully"
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Deleting Stock",
            error: error.message
        });
    }
};
//deleteMultipleStock
const deleteMultipleStocks = async (req, res) => {
    try {
        const { ids } = req.body;  // array of IDs from frontend

        if (!ids || ids.length === 0) {
            return res.json({
                status: 400,
                message: "No Stock IDs Provided"
            });
        }

        const result = await Stock.deleteMany({ _id: { $in: ids } });

        return res.json({
            status: 200,
            message: `${result.deletedCount} Stocks Deleted Successfully`
        });
    } catch (error) {
        return res.json({
            status: 500,
            message: "Error Deleting Stocks",
            error: error.message
        });
    }
};

module.exports={createStock, listStock, updateStock, deleteStock, deleteMultipleStocks};