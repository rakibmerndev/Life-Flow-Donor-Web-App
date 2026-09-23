const express = require("express");
const router = express.Router();
const { getDistricts, getUpazilas } = require("../controllers/areaController");

// Get all districts
router.get("/districts", getDistricts);

// Get upazilas
router.get("/upazilas", getUpazilas);

module.exports = router;
