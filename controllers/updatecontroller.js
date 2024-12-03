

const fs = require("fs");

const updatedata = async (req, res) => {
  try {
    const { id } = req.params; 
    const productlink = req.file ? req.file.filename : null; 

    let updatedata = JSON.parse(fs.readFileSync("storage.json", "utf-8")); 

    const index = updatedata.findIndex((item) => item.id === id); 
    if (index === -1) {
      return res.status(404).json({ message: "Product details not found" });
    }

    const { productname, productdescription, productInformation, location } = req.body; 
    
    updatedata[index].productname = productname || updatedata[index].productname;
    updatedata[index].productdescription = productdescription || updatedata[index].productdescription;
    updatedata[index].productInformation = productInformation || updatedata[index].productInformation;
    updatedata[index].location = location || updatedata[index].location;

    if (productlink) {
      const oldImagePath = `./uploads/${updatedata[index].productlink.split('/').pop()}`; 
      console.log(`New image: ${productlink}`);
      console.log(`Old image path: ${oldImagePath}`);

      if (updatedata[index].productlink && fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath); 
          console.log(`Old image removed: ${oldImagePath}`);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Failed to remove old image" });
        }
      } else {
        console.log(`Old image does not exist: ${oldImagePath}`);
      }

      
      updatedata[index].productlink = `${req.protocol}://${req.get("host")}/uploads/${productlink}`;
      console.log(`Updated productlink: ${updatedata[index].productlink}`);
    } else {
      console.log("No new image uploaded");
    }

    
    fs.writeFileSync("storage.json", JSON.stringify(updatedata, null, 2));

    const responseData = { ...updatedata[index] };
    delete responseData.productlink; 

    res.status(200).json({
      message: "Product details updated successfully",
      data: responseData, 
      productlink
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product details" });
  }
};

module.exports = updatedata;
