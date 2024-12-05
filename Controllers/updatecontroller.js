
const fs = require("fs");
const path = require("path");
const Product = require("../models/fileschema");
const mongoose=require("mongoose")

const updateProduct = async (req, res) => {
  try {
    console.log(req.body);

    const { ProductName, ProductDescrption, ProductPrice, location,quantity } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: " Invalid Mongodb ID format " });
    }

    
    if (!ProductName || !ProductDescrption || !ProductPrice || !location ||!quantity) {
      return res.status(400).json({ message: "Every field is required" });
    }


    if (isNaN(Number(ProductPrice))) {
      return res.status(400).json({ message: "Product Price should be a valid number." });
    }
    if(isNaN(Number(quantity)) || Number(quantity)<=0){
      return res.status(400).json({message:"quantity sould be in a valid number"})
    }

    
    const existProduct = await Product.findById(id);
    if (!existProduct) {
      return res.status(404).json({ message: "Product details were not found" });
    }

const TotalQuantityUpdatedResult=await Product.aggregate([
{
  $match: {
    _id:{$ne:existProduct._id},
     location: { $in: ["hyderabad", "bangalore", "chennai"] }, 
        Image: { $exists: true },
        quantity:{$type:"number"}
      },

  },
    {
      $group:{
        _id:null,
        totalquantity:{$sum:"$quantity"}
      },
    }
   
])
const currentTotalQuantity=TotalQuantityUpdatedResult[0] ?.totalquantity || 0;
console.log(currentTotalQuantity)
const newquantity=currentTotalQuantity+Number(quantity);
console.log(newquantity)

if(newquantity >50){
  return res.status(400).json({message:"updating the product exceed limit is crossed is limit upto 50"})
}

    
    const newImage = req.file ? req.file.filename : null;
    const newImageUrl = newImage ? `${req.protocol}://${req.get("host")}/uploads/${newImage}` : null;

    
    if (newImage && existProduct.Image) {
      const oldImagePath = path.join(__dirname, "..", "uploads", path.basename(existProduct.Image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    
    existProduct.ProductName = ProductName || existProduct.ProductName;
    existProduct.ProductDescrption = ProductDescrption || existProduct.ProductDescrption;
    existProduct.ProductPrice = Number(ProductPrice) || existProduct.ProductPrice;
    existProduct.location = location || existProduct.location;
    existProduct.quantity=Number(quantity) || existProduct.quantity;

    
    if (newImageUrl) {
      existProduct.Image = newImageUrl;
    }

    
    await existProduct.save();

    res.status(200).json({
      message: "Product details were updated successfully",
      data: existProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = updateProduct;
