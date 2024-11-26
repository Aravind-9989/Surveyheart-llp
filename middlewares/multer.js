

const multer = require("multer");
const path=require("path")
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
      // Directly use the original name of the uploaded file
      const originalName = file.originalname;
      cb(null, originalName);
      console.log("File saved with original name:", originalName);
    },
  });
  
  const upload = multer({ storage: storage });

  module.exports =upload