const Favorite = require("../models/favour");
const File = require("../models/fileschema");
const Signup = require("../models/Signupschema");

const Favourite = async (req, res) => {
  try {
    const { id, userId } = req.body;

    console.log(id);
    console.log(userId);

    if (!id || !userId) {
      return res
        .status(400)
        .json({ message: "You have to enter the both id and userid detials" });
    }
    const product = await File.findOne({_id:id});
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const user = await Signup.findOne({_id:userId});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const save = new Favorite({ userId,productId:id });
    await save.save();
    res .status(200).json({ message: "product is added to favourite", save });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Failed to add product from Favuorites" });
  }
};
module.exports = Favourite;
