const Product = require("../models/fileschema");

const Addproductfile = async (req, res) => {
    // required fileds of the requirement
    try {
        const { ProductName, ProductDescrption, ProductPrice, location,quantity} = req.body;
        // requesting for the image 
        const image = req.file ? req.file.filename : null;
    // if the image was not uploading properly this the issue we are facing
        if (!image) {
            return res.status(400).json({ message: " Some issue is occuring while adding the image." });
        }
    // these fields are required to upload the file 
        if (!ProductName || !ProductDescrption || !ProductPrice || !location ||!quantity) {
            return res.status(400).json({ message: "Every field is required." });
        }
        // this condition is because the product price should contain the number 
        if (isNaN(ProductPrice)) {
            return res.status(400).json({ message: "Product Price should be a valid number." });
        }

        if(isNaN(quantity) || quantity <=0){
            return res.status(400).json({ message: "Quantity should be a valid number"})

        }

        const totalproducts=await Product.aggregate([
            {
                $group:{
                    _id:null,
                    totalquantity:{$sum:"$quantity"}
                }
            }
        ])
        const currentquantityproducts=totalproducts.length > 0 ? totalproducts[0].totalquantity:0
        if(!currentquantityproducts+ Number(quantity) > 50){
            return res.status(400).json({message:"product limlit exceeded and items were sold out "})
        }
    //   this imageurl is used to produce the url for the image what we have been uploaded
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${image}`;

        // creating a new product and saving it to the database
        const newProduct = new Product({
            ProductName,
            ProductDescrption,
            ProductPrice,
            location,
            Image:imageUrl, 
            quantity,
        });
        // after adding a new product it will be save
        await newProduct.save();
        // after adding the product giving the sucess response
        res.status(200).json({ message: "Product added successfully" ,newProduct});
    } catch (error) {
        console.error( error);
        res.status(500).json({ message: "Failed to add the product." });
    }
};

module.exports = Addproductfile;
