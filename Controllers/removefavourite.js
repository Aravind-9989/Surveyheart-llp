const Favorite=require("../models/favour");
 const mongoose=require("mongoose")
const RemoveFav=async(req,res)=>{
    try{
        const {id}=req.params;
       
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: " Invalid Mongodb ID format " });
      }
  
        console.log(id)
        if(!id){
            return res.status(400).json({message:"provide the productid"})
        }
        const findfav = await Favorite.findByIdAndDelete({_id:id});
        if(!findfav){
            return res.status(400).json({message:"The product was not found in favourites"})
        }
        res.status(200).json({message:"Product removed from favourites"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports=RemoveFav