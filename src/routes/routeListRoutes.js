const express = require("express");
const router = express.Router();

const {
  createRoute,
  getRouteList,
  getRouteByHaltName,
} = require("../controllers/routeListController");

// Login user
router.post("/", createRoute);

//Get all users
router.get("/", getRouteList);

//Get user by id
router.get("/:haltName", getRouteByHaltName);

module.exports = router;
