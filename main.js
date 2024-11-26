const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Routefolders = require("./routes/route");
const Details=require("./routes/Authroutes")
// middle ware
app.use(express.json());
// All the routes passing with the end the point
app.use("/Routes", Routefolders);

// This routes will be for the authentication and authorization
app.use("/survey",Details)

// when we are passing the url into the browser the image will be displayed
app.use("/uploads", express.static(path.join(__dirname,"uploads")));


// mongodb connection 
mongoose.connect("mongodb://localhost:27017/Aravinds")
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.error("Database connection failed:");
    });

app.listen(3006, () => {
    console.log("Server is running on port 3006");
});
