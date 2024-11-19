const fs = require("fs");
const path = require("path");


const deletedata = (req, res) => {
  try {
    const { id } = req.params;
    // the is is passing from the url parameterd

    let data = JSON.parse(fs.readFileSync("storage.json", "utf-8"));
    // the file will be read
    console.log(" before deletion of data:", data);

    const index = data.findIndex((item) => item.id === id);
    // the index of the item to be deleted is found

    if (index === -1) {
      return res.status(404).json({ message: "id details was not found" });
    }
    // if the id is not found then the status will be 404 and the message will be

    const itemToDelete = data[index];
    // the item to be deleted is found
    console.log("Item to delete:", itemToDelete);

    data.splice(index, 1);
// the files write in this existing not to create and it will be updated
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

    res.status(200).json({ message: "Item was deleted successfully" });
  } catch (error) {
    console.error("Error during deleting:", error);
    res
      .status(500)
      .json({ message: "An issue occurred while deleting the details" });
  }
};

module.exports = deletedata;
