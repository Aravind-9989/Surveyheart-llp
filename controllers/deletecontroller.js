const fs = require("fs");
const path = require("path");


const deletedata = (req, res) => {
  try {
    const { id } = req.params;
    

    let data = JSON.parse(fs.readFileSync("storage.json", "utf-8"));
 
    console.log(" before deletion of data:", data);

    const index = data.findIndex((item) => item.id === id);
   

    if (index === -1) {
      return res.status(404).json({ message: "id details was not found" });
    }
   

    const itemToDelete = data[index];
    
    console.log("Item to delete:", itemToDelete);

    data.splice(index, 1);

    fs.writeFileSync("storage.json", JSON.stringify(data, null));

    if (itemToDelete.productlink) {
      const filename = path.basename(itemToDelete.productlink);
      const paths = `./uploads/${filename}`;

      if (fs.existsSync(paths)) {
        try {
          fs.unlinkSync(paths);
          console.log("Image file deleted successfully:", paths);
        } catch (err) {
          console.error("Error deleting image:", err);
          return res
            .status(500)
            .json({ message: "Failed to delete the image file" });
        }
      } else {
        console.log("Image file doesn't exist:", paths);
      }
    }

    res.status(200).json({ message: "Item was deleted successfully",itemToDelete });
  } catch (error) {
    console.error("Error during deleting:", error);
    res
      .status(500)
      .json({ message: "An issue occurred while deleting the details" });
  }
};

module.exports = deletedata;
