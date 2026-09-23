const express = require("express");
const router = express.Router();
const { generateToken } = require("../controllers/authController");

// JWT token generation
router.post("/jwt", generateToken);

module.exports = router;
