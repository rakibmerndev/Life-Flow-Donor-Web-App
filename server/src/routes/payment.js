const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  createPaymentIntent,
  processPayment,
  getUserDonations,
} = require("../controllers/paymentController");

// Create payment intent
router.post("/create-payment-intent", verifyToken, createPaymentIntent);

// Process payment
router.post("/payments", verifyToken, processPayment);

// Get user donations
router.get("/payments/:email", verifyToken, getUserDonations);

module.exports = router;
