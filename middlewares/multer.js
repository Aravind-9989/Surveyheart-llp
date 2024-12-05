
const multer = require('multer');

const storage = multer.diskStorage({
  destination: "uploads/",  
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = `${timestamp},${file.originalname}`;    cb(null, originalName);
    console.log("File saved with original name:", originalName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },  
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|svg/;
    const mimeType = allowedTypes.test(file.mimetype);
    
    if (mimeType) {
      // image/jpeg,image/png,image/gif,image/svg
      return cb(null, true);  
    } else {
      return cb(new Error("Only JPEG, JPG, PNG, and SVG formats are allowed"), false);  
    }
  },
});
module.exports = upload;
