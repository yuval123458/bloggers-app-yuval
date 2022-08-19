const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
console.log(process.env);
const config = require("config");

const app = express();
const fs = require("fs");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const httpError = require("./models/http-error");
const mongoose = require("mongoose");

console.log(config.get("mongoURI"));

const URL = config.get("mongoURI");

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use(express.static(path.join("public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(URL)
  .then(() => {
    console.log("mongoose connected..");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`server running...`)
    );
  })
  .catch((err) => {
    console.log("error: ");
    console.log(err.message);
  });
