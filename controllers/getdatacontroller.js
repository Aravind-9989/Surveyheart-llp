const fs = require("fs");

const getlocation = (req, res) => {
  const { location } = req.params;

  let data = JSON.parse(fs.readFileSync("storage.json"));
  // json.parse it will be convert it into the json text which is in js object
  const locationdetails = data.find(
    (obj) =>
      obj.location && obj.location.toLowerCase() === location.toLowerCase()
  );
  // this details will be find the obj the every letter is converted into the lower case letter to match location

  if (!locationdetails) {
    return res.status(404).json({ message: "Location details was not found" });
  }

  // this if condotion is used to check the valid request the user or not

  res
    .status(200)
    .json({
      message: "Location details was fetching sucessfully",
      data: locationdetails,
    });

  console.log(locationdetails);
};

module.exports = getlocation;
