const express = require("express");
const router = express.Router();

const {
  loginUser,
  signupUser,
  createUser,
  getAllUsers,
  getUserById,
  getUserByRole,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");

// Login user
router.post("/login", loginUser);

// Signup user
router.post("/signup", signupUser);

// Create user
router.post("/", createUser);

//Get all users
router.get("/", getAllUsers);

//Get user by id
router.get("/:id", getUserById);

//Get user by role
router.get("/role", getUserByRole);

//Update user by id
router.put("/:id", updateUserById);

//Delete user by id
router.delete("/:id", deleteUserById);

module.exports = router;
