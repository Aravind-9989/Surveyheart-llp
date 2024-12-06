const Product = require("../models/fileschema");

const Addproductfile = async (req, res) => {
  try {
    const { ProductName, ProductDescrption, ProductPrice, location, quantity } =
      req.body;
     
    
    const image = req.file ? req.file.filename : null;
    if (!image) {
      return res  
        .status(400)
        .json({ message: "Some issue is occuring while adding the image." });
    }
    if (
      !ProductName ||
      !ProductDescrption ||
      !ProductPrice ||
      !location ||
      !quantity
    ) 
  
    {
      return res.status(400).json({ message: "Every field is required." });
    }
  
    if (isNaN(ProductPrice)) {
      return res
        .status(400)
        .json({ message: "Product Price should be a valid number." });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity should be a valid number" });
    }

    const totalproducts = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalquantity: { $sum: "$quantity" },
        },
      },
    ]);
    const currentquantityproducts =
      totalproducts.length > 0 ? totalproducts[0].totalquantity : 0;
    if (!currentquantityproducts + Number(quantity) > 50) {
      return res
        .status(400)
        .json({ message: "product limlit exceeded and items were sold out " });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${image}`;

    const newProduct = new Product({
      ProductName,
      ProductDescrption,
      ProductPrice,
      location,
      Image: imageUrl,
      quantity,
    });
    await newProduct.save();
    res.status(200).json({ message: "Product added successfully", newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add the product." });
  }
};

module.exports = Addproductfile;
