const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  createRequest,
  getAllRequests,
  getCurrentUserRequests,
  getRequestById,
  updateRequest,
  updateRequestStatus,
  markRequestDone,
  cancelRequest,
  deleteRequest,
} = require("../controllers/requestController");

// Create donation request
router.post("/request", verifyToken, createRequest);

// Get all requests
router.get("/request", getAllRequests);

// Get current user requests
router.get("/current-user-requests", verifyToken, getCurrentUserRequests);

// Get request by ID
router.get("/request/:id", verifyToken, getRequestById);

// Update request
router.patch("/request/:id", verifyToken, updateRequest);

// Update request status (donor assignment)
router.patch("/status/:id", verifyToken, updateRequestStatus);

// Mark request as done
router.patch("/done/:id", verifyToken, markRequestDone);

// Cancel request
router.patch("/cancel/:id", verifyToken, cancelRequest);

// Delete request
router.delete("/request/:id", verifyToken, deleteRequest);

module.exports = router;
