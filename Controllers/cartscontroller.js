const mongoose = require("mongoose");
const Carts = require("../models/cartschema");
const File = require("../models/fileschema");
const Signup = require("../models/Signupschema");

const Addproductcart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log(userId);
    console.log(productId);
    console.log(quantity);

    if (!userId || !productId || !quantity) {
      return res.status(404).json({ message: "You must provide userId, productId, and quantity" }); }

    if (isNaN(quantity) || quantity <= 0) {
      return res .status(400).json({ message: "quantity must be in valid number" });
    }

    const user = await Signup.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user)
    const productcart = await File.findById({ _id: productId });
    if (!productcart) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(productcart);

    let cart = await Carts.findOne({ userId });
    
    if (!cart) {
      const totalPrice = productcart.ProductPrice * quantity;
    
      if (isNaN(totalPrice) || totalPrice <= 0) {
        return res.status(400).json({ message: "Invalid totalPrice calculation" });
      }
      cart = new Carts({
        userId,
        products: [
          {
            productId,
            quantity,
            totalPrice: productcart.ProductPrice * quantity,
          },
        ],
      });
      await cart.save()
      // upto this we can create the product and calculate the product
    }
    
// form here if the same user has been adding the products here we can add the products with exist user only
// and it will save the product
    // 
 else {
      const indexproduct = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (indexproduct >= 0) {
        cart.products[indexproduct].quantity += quantity;
        cart.products[indexproduct].totalPrice =
          cart.products[indexproduct].quantity * productcart.ProductPrice;
      } else {
        const totalPrice = productcart.ProductPrice * quantity;
        if (totalPrice) {
          return res.status(400).json({ message: "Invalid totalPrice calculation" });
        }

        cart.products.push({
          productId,
          quantity,
          totalPrice,
        });
      }
    }

    await cart.save();
    // 
    return res.status(200).json({ message: "Product successfully added in the cart",cart});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const removecart=async(req,res)=>{
  try{
  const {userId,productId}=req.body;
    const cartmember=await Carts.findOne({userId})
    console.log(cartmember)
    if(!cartmember){
      return res.status(404).json({message:"cart user not found"})
    }
    cartmember.products=cartmember.products.filter(items=>items.productId.toString()!==productId)
    console.log(cartmember)
    await cartmember.save()
    return res.status(200).json({message:"product was remove the cart"})
  }
  catch(err){
    console.log(err)
    return res.status(500).json({message:"Internal server error for cart item"})
  }
}

const Gettingproductsformcart=async(req,res)=>{
  console.log("hello");
  try{
    const {userId}=req.params;
    console.log(userId);
    
    const Userexist=await Signup.findById(userId)
    console.log(Userexist)
    if(!Userexist){
      return res.status(404).json({message:"user details not found"})
    }
    console.log(Userexist)
    const Foundcart=await Carts.findOne({userId})
    if(!Foundcart){
      return res.status(400).json({message:"cart details are not found for this user"})
    }
    console.log(Foundcart)

    const cart = await Carts.aggregate([
      { $match: { userId:new mongoose.Types.ObjectId(userId) } }, 
      { $unwind: "$products" }, 
      {
          $addFields: {
              totalPrice: { $multiply: ["$products.price", "$products.quantity"] } 
          }
      },
      {
          $group: {
              _id: "$_id", 
              products: { $push: "$products" }, 
              totalSum: { $sum: "$totalPrice" } 
          }
      }
  ]);
    console.log(cart)

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty, no items found" });
    }
return res.status(200).json({message:"Fetching products from the cart",cart})
  }
  catch(err){
console.log(err)
return res.status(500).json({message:"Internal server error"})
}
}

module.exports = {Addproductcart,removecart,Gettingproductsformcart};



























