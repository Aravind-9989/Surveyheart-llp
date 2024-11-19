// const multer = require("multer");
const fs = require("fs");
const path = require("path");

let Filesuploaded = [];
// the files will be checked whether files are exists are not
if (fs.existsSync("storage.json")) {
  // in this read file will be reads and it will work 
  const sendingjsondata = fs.readFileSync("storage.json");
  try {
    Filesuploaded = JSON.parse(sendingjsondata);
    console.log("Data was stored in the JSON");
  } catch (error) {
    console.log(error);
  }
}
// this product handle to identifies requires fields to the next procedure of handling the data
const producthandle = async (req, res) => {
  try {
    const {
      id,
      productname,
      productdescription,
      productInformation,
      location,
    } = req.body;
    console.log(req.body);

    const productlink = req.file ? req.file.filename : null;
    // this image url is used dispaly in the localhost easy to identify 
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${productlink}`;
// this if condition is used check the every filed must should work with requires fields when these are fine it proceed for the data
    if (
      !id ||
      !productname ||
      !productdescription ||
      !productInformation ||
      !location
    ) {
      return res.status(400).json({ message: "Every field is required" });
    }

    const fileData = {
      id,
      productname,
      productdescription,
      productInformation,
      productlink:imageUrl,
      location,
    };

    console.log(fileData);
// the data will be push 
    Filesuploaded.push(fileData);

    // Save the updated data to storage.json
    fs.writeFile(
      "storage.json",
      JSON.stringify(Filesuploaded, null, 2),
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Data was not saved" });
        }
        console.log("Data is saved to storage.json");
        res
          .status(200)
          .json({ message: "File uploaded successfully", fileData });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Issue with the file upload. Fields may not have been entered properly.",
    });
  }
};

module.exports = producthandle;
