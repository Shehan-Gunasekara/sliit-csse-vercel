const express = require("express");
const router = express.Router();

const {
  createRouteHistory,
  getRouteHistory,
  getRouteByUser,
  updateRouteStatus,
  endRoute,
} = require("../controllers/routeHistoryController");

// Login user
router.post("/", createRouteHistory);

//Get all users
router.get("/", getRouteHistory);

//Get user by id
router.get("/:passengerID", getRouteByUser);

router.patch("/updateStatus/:passengerID", updateRouteStatus);

router.get("/endRoute/:passengerID", endRoute);

module.exports = router;
