const express = require("express");
const router = express.Router();
const {
  getAllDeliveries,
  addDelivery,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");

// Fetch all deliveries
router.get("/", getAllDeliveries);

// Add a new delivery
router.post("/", addDelivery);

// Update delivery status
router.put("/:id", updateDeliveryStatus);

module.exports = router;