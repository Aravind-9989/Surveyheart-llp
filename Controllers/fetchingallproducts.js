const File = require("../models/fileschema");

const Getallproduct = async (req, res) => {
  try {
    const product = await File.find();
    console.log(product)
    const Totalprice = await File.aggregate([
      {
        $match: {
          location: { $in: ["hyderabad", "banglore", "chennai"] },
          Image: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          price: {
            $sum: "$ProductPrice",
          },
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);
    console.log(Totalprice)

    if (Totalprice.length === 0) {
      return res.status(404).json({ message: "No product details were found" });
    }
    const totalQuantitySum = Totalprice[0]?.totalQuantity || 0;
    if (totalQuantitySum > 50) {
      return res
        .status(404)
        .json({
          message: "Total quantites of product should not exceed the limit 50",
        });
    }

    const sum = Totalprice[0]?.price || 0;

    return res.status(200).json({
      message: "Fetched all products successfully",
      product,
      totalPrice:sum,
      totalQuantity: totalQuantitySum,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Product details were not found" });
  }
};

module.exports = Getallproduct;
