

const express = require("express");
const router = express.Router();

// const verify=require("../middlewares/Authmiddleware")


const Credentials=require("../Controllers/Authcontroller")
router.post("/Entries",Credentials.Signupdetails)
router.post("/Login",Credentials.Logins)

module.exports=router