const mongoose=require("mongoose");

const Signupschema= new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:[
            "admin",
            "user"
        ],
        default:"user"
    },

})
const Signup=mongoose.model("User",Signupschema)
module.exports=Signup