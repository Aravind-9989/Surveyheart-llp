const express = require("express");
const app = express();
const path = require("path");
const Routefolders = require("./routes/route");
const Details = require("./routes/Authroutes");
const dotenv = require("dotenv");
dotenv.config({ path: "./configuration.env", debug: true });
const multer=require("multer")

const mongoose = require("mongoose");

app.use(express.json());
app.use("/Routes", Routefolders);

app.use("/survey", Details);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send("file should not excced with 2mb");
  } else {
    res.status(400).send('Error is occuring during file uploading');
  }
});
mongoose
  // .connect("mongodb://localhost:27017/testdb")
  .connect("mongodb://localhost:27017/Aravinds")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });

app.listen(3006, () => {
  console.log("Server is running on port 3006");
});
module.exports = {app};
