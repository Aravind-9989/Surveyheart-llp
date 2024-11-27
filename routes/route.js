const express = require("express");
const router = express.Router();
// middleware
const Multerfiles = require("../middlewares/multer");
// creating files
const Filesuploads = require("../Controllers/fileuploadingcontroller");
const updateid = require("../Controllers/updatecontroller");
const deleted = require("../Controllers/deletecontroller");
const fetchdetails = require("../Controllers/fetchingproductcontroller");
const Products=require("../Controllers/fetchingallproducts")
const Cartcontroller=require("../Controllers/cartscontroller")
const placingorders=require("../Controllers/ordercontroller");
// Authorization
const {authenticate,authorizerole,VerifyAdmin}=require("../middlewares/Authmiddleware")

// making the products into wishlist
const Fav=require("../Controllers/Favouriteproducts");
const RemoveFav=require("../Controllers/removefavourite");

router.post("/File",authenticate,authorizerole("admin"),VerifyAdmin, Multerfiles.single("productImage"), Filesuploads);
router.put("/Updates/:id",authenticate,authorizerole("admin"),VerifyAdmin, Multerfiles.single("productImage"), updateid);
router.delete("/deletes/:productId", authenticate,authorizerole("admin"),VerifyAdmin,deleted);
router.get("/fetch/:id", fetchdetails);
router.get("/Allproducts",Products)

router.post("/favourite",Fav);
router.post("/Delete/:id",RemoveFav)

router.post("/carts",Cartcontroller.Addproductcart)
router.post("/remove",Cartcontroller.removecart)
router.get("/fetchcart/:userId",Cartcontroller.Gettingproductsformcart)

router.post("/placed/:userId",placingorders.orderplaced)
router.get("/getdata",placingorders.getorders)

module.exports = router;
