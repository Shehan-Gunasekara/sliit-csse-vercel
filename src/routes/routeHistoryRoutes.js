const express = require("express");
const router = express.Router();

const {
  createRouteHistory,
  getRouteHistory,
  getRouteByUser,
} = require("../controllers/routeHistoryController");

// Login user
router.post("/", createRouteHistory);

//Get all users
router.get("/", getRouteHistory);

//Get user by id
router.get("/:passengerID", getRouteByUser);

module.exports = router;
