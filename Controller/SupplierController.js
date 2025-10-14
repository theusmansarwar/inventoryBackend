const { parse } = require("dotenv");
const Supplier= require("../Models/SupplierModel");

//create Supplier
// const createSupplier = async(req,res) => {
//     try{
//         const{name,contact,email,address,status} = req.body;

//         const supplier=await Supplier.create({
//             name,
//             contact,
//             email,
//             address,
//             status
//         });
//         res.status(201).json({
//             message: "Supplier created successfully",
//             supplier
//         });
//     }catch(error){
//         res.status(500).json({error: error.message});
//     }
// };

// Create Supplier
const createSupplier = async (req, res) => {
  try {
    const { name, contact, email, address, status} = req.body;

    const missingFields = [];

    // ✅ Validate required only if publishing
   
      if (!name) missingFields.push({ name: "name", message: "Name is required" });
      if (!contact) missingFields.push({ name: "contact", message: "Contact is required" });
      if (!email) missingFields.push({ name: "email", message: "Email is required" });
      if (!address) missingFields.push({ name: "address", message: "Address is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
    

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
      });
    }

    const supplier = new Supplier({
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
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while creating supplier",
      details: error.message,
    });
  }
};

//list + search supplier with pagination
    const listSuppliers = async(req, res) => {
        try{
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const limit = Math.min(parseInt(req.query.limit) || 10, 50);

            //keyword
            const keyword = (req.query.keyword || "").trim();
            let filter ={};

            if(keyword){
                const regex= new RegExp(keyword, "i");
                filter ={
                    $or:[
                        {name: {$regex: regex} },
                        {contact: {$regex: regex}},
                        {email: {$regex: regex}},
                        {address: {$regex: regex}}
                    ],
                };
            }

            const totalSuppliers=await Supplier.countDocuments(filter);
            const suppliers = await Supplier.find(filter)
            .sort({createdAt: -1})
            .limit(limit)
            .skip((page-1) * limit);

            res.status(200).json({
                totalSuppliers,
                totalPages: Math.ceil(totalSuppliers / limit),
                currentPage: page,
                limit,
                suppliers,   
            });
        }catch(error){
            res.status(500).json({error: error.message});
        }
        };

        //updateSupplier
        // const updateSupplier = async(req,res) => {
        //     try{
        //         const { id } = req.params;
        //         const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body,{
        //             new: true,
        //             runValidators: true,
        //         });

        //     if(!updatedSupplier){
        //         return res.status(404).json({error: "supplier not found"});
        //     }

        //     res.status(200).json({
        //         message: "Supplier updated Successfully",
        //         supplier: updatedSupplier,
        //     });
        // }
        //     catch(error){
        //         res.status(500).json({error: error.message});
        //     }
        // }

        // Update Supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, address, status} = req.body;

    const missingFields = [];

    // ✅ Validate required only if publishing
   
      if (!name) missingFields.push({ name: "name", message: "Name is required" });
      if (!contact) missingFields.push({ name: "contact", message: "Contact is required" });
      if (!email) missingFields.push({ name: "email", message: "Email is required" });
      if (!address) missingFields.push({ name: "address", message: "Address is required" });
      if (!status) missingFields.push({ name: "status", message: "Status is required" });
    

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        missingFields,
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
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while updating supplier",
      details: error.message,
    });
  }
};

        //deleteSupplier
        const deleteSupplier = async(req,res) => {
            try{
                const { id } = req.params;
                const deletedSupplier = await Supplier.findByIdAndDelete(id);

                if(!deletedSupplier){
                    return res.status(404).json({error: "Supplier not found"});
                }
                res.status(200).json({message: "Supplier deleted Successfully"});
            }catch(error){
                res.status(500).json({error: error.message});
            }
        };
        //multipleDelete
        const deleteMultipleSuppliers = async(req,res) => {
            try{
                const { ids } = req.body;
                if(!ids || ids.length === 0){
                    return res.status(400).json({error: "please provide an array of Supplier IDs"});
                }
                const result=await Supplier.deleteMany({_id: {$in: ids} });
                res.status(200).json({
                    status: 200,
                    message: `${result.deletedCount} supplier(s) deleted Successfully`,
                });
            }catch(error){
                res.status(500).json({error: error.message});
            }
        };
module.exports={createSupplier, listSuppliers, updateSupplier, deleteSupplier, deleteMultipleSuppliers};