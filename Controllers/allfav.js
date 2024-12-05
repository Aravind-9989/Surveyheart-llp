const Favorite = require("../models/favour");

const allfavourites = async (req, res) => {
  try {
    const { userId } = req.body; 

    if (!userId) {
      return res
        .status(400)
        .json({ message: "You must provide the userId to fetch favourites." });
    }

    const userFavourites = await Favorite.find({ userId }).populate("productId"); 

    if (!userFavourites || userFavourites.length === 0) {
      return res
        .status(404)
        .json({ message: "No favourite products found for this user." });
    }

    res.status(200).json({
      message: "Fetched user's favourites successfully",
      favourites: userFavourites,
    });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = allfavourites;
