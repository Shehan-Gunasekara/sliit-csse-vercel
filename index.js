require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const multer = require("multer");

const port = process.env.PORT;
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(cors());

//Import Routes
const userRoutes = require("./src/routes/userRoutes");
const routeHistoryRoutes = require("./src/routes/routeHistoryRoutes");
const routeListRoutes = require("./src/routes/routeListRoutes");
//Use routes
app.use("/api/users", userRoutes);
app.use("/api/routeHistory", routeHistoryRoutes);
app.use("/api/routeList", routeListRoutes);
//Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

module.exports = app;
