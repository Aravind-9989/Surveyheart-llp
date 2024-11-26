
const fs = require("fs");
const path = require("path");
const product = require("../models/fileschema");

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(productId);

    const productToDelete = await product.findById(productId);
    if (!productToDelete) {
      return res.status(404).json({ error: " product id details was not found" });
    }

    console.log("ProductImage details was stored in the Mongodbdatabase", productToDelete.Image);

    if (productToDelete.Image) {
      // the path.basename is used to Extracts the file name from a full file path or URL.
      const filename = path.basename(productToDelete.Image);
      // the path.resolve is used Resolves a sequence of path segments into an absolute path.
      const filePath = path.resolve(__dirname, "../uploads", filename);

      console.log(filePath);

      if (fs.existsSync(filePath)) {

        try {
          const fsPromises = fs.promises;
          await fsPromises.unlink(filePath); // Delete the file asynchronously
          console.log("Image file was deleted successfully:", filePath);
        } catch (error) {
          console.log(error)
          return res
            .status(500)
            .json({ message: "Failed to delete the image file" });
        }
      } else {
        console.log("File doesn't exist at the  path:", filePath);
      }
    } else {
      console.log("No Image found for this product.");
    }

    await product.findByIdAndDelete(productId);

    return res
      .status(200)
      .json({ message: "Product and image deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deleteProductById;
