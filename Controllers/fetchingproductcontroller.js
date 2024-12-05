const product = require("../models/fileschema");
const mongoose=require("mongoose")
const Fetchingproduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: " Invalid Mongodb ID format " });
    }

    if (!id) {
      return res
        .status(400)
        .json({ message: "Please provide the product ID." });
    }

    console.log(id);

    const Findproduct = await product.findById(id);

    if (!Findproduct) {
      console.log("Product details was not found for ID:", id);
      return res.status(404).json({ message: "Product details not found." });
    }

    console.log("Found the Product", Findproduct);

    res
      .status(200)
      .json({ message: "Product details found.", data: Findproduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server issue." });
  }
};

module.exports = Fetchingproduct;
