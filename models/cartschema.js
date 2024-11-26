const mongoose = require("mongoose");

const Addtocarts = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Signup",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: true,
      },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Carts= mongoose.model("Carts", Addtocarts);
module.exports = Carts;
