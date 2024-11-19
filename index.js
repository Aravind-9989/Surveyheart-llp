const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());

const itemroutes =require("./routes/route")

// these staic files will be viewed in the browser by using  localhost with the image link 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/items",itemroutes);

app.listen(3005, () => {
  console.log("Server is running on port 3005");
});
