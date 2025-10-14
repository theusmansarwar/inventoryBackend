const Product = require("../Models/ProductModel");

//create
// const createProduct = async(req,res) => {
//     try{
//         const {productName, category, status} = req.body;

//         if(!productName || !category){
//             return res.status(404).json({error: "Product Name and Category are required"});
//         }
//         const product = await Product.create({
//             productName,
//             category,
//             status
//         });
//         res.status(201).json({
//             message: "Product created Successfully", 
//             product
//         });
//     }catch(err){
//         res.status(500).json({error: err.message});
//     }
// };

// Create Product
const createProduct = async (req, res) => {
  try {
    const { productName, category, status} = req.body;

    const missingFields = [];

    //  Validate required only if publishing
  
      if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
      if (!category) missingFields.push({ name: "category", message: "Category is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
 

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const product = new Product({
      productName,
      category,
      status,
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

//list with pagination & Search
const listProducts = async(req,res) => {
    try{
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        
        //keyword
        const keyword=(req.query.keyword || "").trim();
        let filter = {};

        if(keyword){
            const regex = new RegExp(keyword, "i");//case insensitive search
            filter = {
                $or: [
                    {productName: {$regex: regex} },
                    {category: {$regex: regex} },
                ],
            };
        }


        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
        .sort({ createdAt: -1})
        .limit(limit)
        .skip((page - 1) * limit);

        res.status(200).json({
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            limit,
            products,
        });
    }catch(error){
    res.status(500).json({error: error.message});
    }
};

//update product
// const updateProduct = async(req,res) => {
//     try{
//         const { id }=req.params;
//         const {productName, category,status} =req.body;

//         const product = await Product.findByIdAndUpdate(
//             id,
//             {productName, category,status},
//             {new: true, runValidators: true},
//         );

//         if(!product){
//             return res.status(404).json({error: "Product Not Found"});
//         }

//         res.status(200).json({
//             message:"Product updated Successfully",
//             product,
//         });
//     }
//     catch(err){
//         res.status(500).json({error: err.message });
//     }
// };

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, category, status } = req.body;

    const missingFields = [];
    //✅ Validate required only if publishing
  
      if (!productName) missingFields.push({ name: "productName", message: "Product Name is required" });
      if (!category) missingFields.push({ name: "category", message: "Category is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
  

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { productName, category, status },
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

//delete product
const deleteProduct = async(req,res) => {
    try{
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({error: "Product not found"});
        }
        res.status(200).json({
            message: "product deleted successfully",
            product,
        });
    }catch(error){
        res.status(500).json({error: error.message});
    }
};
//Multiple delete products
const deleteMultipleProducts = async(req, res) => {
    try{
    const { ids } = req.body;
    if(!ids || ids.length === 0){
        return res.status(400).json({error:"Please provide an array of product IDs "})
    }

    const result = await Product.deleteMany({_id: {$in: ids} });
    if(result.deletedCount===0){
        return res.status(404).json({error: "No products found for detection"});
    }

    res.status(200).json({
      status: 200,
      message:"Products deleted Successfully",
      deletedCount: result.deletedCount, 
    });
}catch(error){
    res.status(200).json({
        error: error.message
    });
}
};


module.exports = {createProduct, listProducts, updateProduct, deleteProduct, deleteMultipleProducts}