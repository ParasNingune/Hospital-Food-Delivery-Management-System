const express = require("express");
const router = express.Router();
const {
  getAllDeliveries,
  addDelivery,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");

router.get("/", getAllDeliveries);

router.post("/", addDelivery);

router.put("/:id", updateDeliveryStatus);

module.exports = router;