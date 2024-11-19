

const fs = require("fs");

const upadatedata = async (req, res) => {
  try {
    let { id } = req.params;

    const image = req.file ? req.file.filename : null;
    const { productname, productdescription, productInformation, location } = req.body;

    let updatedata = JSON.parse(fs.readFileSync("storage.json", "utf-8"));

    const index = updatedata.findIndex((item) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Product details were not found" });
    }

    updatedata[index].productname = productname || updatedata[index].productname;
    updatedata[index].productdescription =
      productdescription || updatedata[index].productdescription;
    updatedata[index].productInformation =
      productInformation || updatedata[index].productInformation;
    updatedata[index].location = location || updatedata[index].location;

    if (image) {
      if (updatedata[index].image) {
        const oldImagePath = `./uploads/${updatedata[index].image}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updatedata[index].image = image;
    }

    fs.writeFileSync("storage.json", JSON.stringify(updatedata, null, 2));

    res.status(200).json({
      message: "Product details updated successfully",
      data: updatedata[index],
    });
  } catch (error) {
    console.error("Error updating product details:", error);
    res.status(500).json({ message: "Error updating product details" });
  }
};

module.exports = upadatedata;
