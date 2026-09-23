const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { getAdminStats } = require("../controllers/statsController");

// Get admin statistics
router.get("/admin-stats", verifyToken, getAdminStats);

module.exports = router;
