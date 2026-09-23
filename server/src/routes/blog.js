const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");
const {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  publishBlog,
  deleteBlog,
} = require("../controllers/blogController");

// Create blog post
router.post("/blogs", verifyToken, createBlog);

// Get all blogs (Admin only)
router.get("/blogs", verifyToken, getAllBlogs);

// Get published blogs
router.get("/show-blogs", getPublishedBlogs);

// Get blog by ID
router.get("/blog/:id", verifyToken, getBlogById);

// Publish blog (Admin only)
router.patch("/blogs/:id", verifyToken, verifyAdmin, publishBlog);

// Delete blog (Admin only)
router.delete("/blogs/:id", verifyToken, verifyAdmin, deleteBlog);

module.exports = router;
