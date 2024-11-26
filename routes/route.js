const express = require("express");
const router = express.Router();

const Multerfiles = require("../middlewares/multer");
const Filesuploads = require("../Controllers/fileuploadingcontroller");
const updateid = require("../Controllers/updatecontroller");
const deleted = require("../Controllers/deletecontroller");
const fetchdetails = require("../Controllers/fetchingproductcontroller");
const {authenticate,authorizerole,VerifyAdmin}=require("../middlewares/Authmiddleware")
const Products=require("../Controllers/fetchingallproducts")

const Fav=require("../Controllers/Favouriteproducts");
const RemoveFav=require("../Controllers/removefavourite");


const Cartcontroller=require("../Controllers/cartscontroller")

router.post("/File",authenticate,authorizerole("admin"),VerifyAdmin, Multerfiles.single("productImage"), Filesuploads);
router.put("/Updates/:id",authenticate,authorizerole("admin"),VerifyAdmin, Multerfiles.single("productImage"), updateid);
router.delete("/deletes/:productId", authenticate,authorizerole("admin"),VerifyAdmin,deleted);
router.get("/fetch/:id", fetchdetails);
router.get("/Allproducts",Products)

router.post("/favourite",Fav);
router.post("/Delete/:id",RemoveFav)

router.post("/carts",Cartcontroller.Addproductcart)
router.post("/remove",Cartcontroller.removecart)

module.exports = router;
