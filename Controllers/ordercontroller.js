const Order = require("../models/orderschema");
const Carts = require("../models/cartschema");
const Signup = require("../models/Signupschema");
const  mongoose = require("mongoose");

const orderplaced = async (req, res) => {
  try {
    const { userId } = req.params;
    const status=req.body.status || "pending";
    console.log(userId)
    const userexist=await Signup.findById(userId)
    if(!userexist){
        return res.status(400).json({message:"user details not found"})
    }
    console.log(userexist)
   
    const cartexist = await Carts.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $unwind: "$products" },
        {
          $addFields: {
            totalPrice: { $multiply: ["$products.totalPrice", "$products.quantity"] },
          },
        },
        {
          $group: {
            _id: "$userId",
            products: { $push: "$products" },
            totalSum: { $sum: "$totalPrice" },
          },
        },
      ]);
    
    console.log(cartexist) 
    if(!cartexist || !cartexist.length===0||!cartexist[0].products ||cartexist[0].products.length===0){
        return res.status(400).json({message:"cart not found"})
        }
    const {products,totalSum}=cartexist[0];
    const order = new Order({
      userId: userId,
      products: products,
      totalSum:totalSum,
      status: "pending",
    });
    await order.save();
    console.log(order)
    return res.status(200).json({ message: "Order placed",order });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {orderplaced};
