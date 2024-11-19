const express = require("express");
const router = express.Router(); 


const upload=require("../middlewares/multer")
const Files = require("../controllers/fileuploadingcontroller");
const deletedata = require("../controllers/deletecontroller");
const fetch=require("../controllers/getdatacontroller")
const updates=require("../controllers/updatecontroller")


router.post("/fileuploads", upload.single("productlink"), Files);
// The "productlink field will handle the uploaded file and save it with the original name
// this product link is a key easy to identify where we are pushing the images into a file 
router.delete("/removes/:id",deletedata);
router.get("/fetches/:location",fetch)
router.put("/update/:id",upload.single("productlink"),updates)





module.exports = router;
