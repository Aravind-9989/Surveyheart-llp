const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Signup",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File", 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
