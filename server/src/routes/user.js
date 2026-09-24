const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");
const {
  createUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  checkAdmin,
  makeAdmin,
  makeVolunteer,
  blockUser,
  activateUser,
  deleteUser,
  searchDonors,
} = require("../controllers/userController");

// Create user
router.post("/user", createUser);

// Get all users (Admin only)
router.get("/user", verifyToken, verifyAdmin, getAllUsers);

// Get user profile
router.get("/profile", getUserProfile);

// Update user profile
router.patch("/user", verifyToken, updateUserProfile);

// Check if user is admin
router.get("/users/admin/:email", verifyToken, checkAdmin);

// Make user admin
router.patch("/users/admin/:id", verifyToken, verifyAdmin, makeAdmin);

// Make user volunteer
router.patch("/users/volunteer/:id", verifyToken, verifyAdmin, makeVolunteer);

// Block user
router.patch("/users/block/:id", verifyToken, verifyAdmin, blockUser);

// Activate user
router.patch("/users/active/:id", verifyToken, verifyAdmin, activateUser);

// Delete user
router.delete("/users/delete/:id", verifyToken, verifyAdmin, deleteUser);

// Search donors (with optional filters for bloodGroup, district, upazila)
// Returns all donors if no filters provided, or filtered donors if filters provided
router.get("/search", searchDonors);

module.exports = router;
