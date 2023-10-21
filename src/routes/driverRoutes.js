const express = require("express");
const router = express.Router();

const {
  getDriverById,
  createDriver,
  getAllDrivers,
  updateDriverById,
  deleteDriverById,
} = require("../controllers/driverController");

// Create user
router.post("/", createDriver);

//Get all users
router.get("/", getAllDrivers);

//Get user by id
router.get("/:id", getDriverById);

//Update user by id
router.put("/:id", updateDriverById);

//Delete user by id
router.delete("/:id", deleteDriverById);

module.exports = router;
