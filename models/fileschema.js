const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  ProductDescrption: {
    type: String,
    required: true,
  },
  ProductPrice: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  Image: { 
    type: String,
    required: true,
},
sum:{
  type:Number,
  required:false
},
quantity:{
  type:Number,
  required:true,
  default:50,
},
},{timestamps:true});

const File = mongoose.model("File", FileSchema);
module.exports = File;
