const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// In-memory data for deliveries (Replace with actual DB in production)
let deliveries = [
  {
    id: 1,
    patientId: 1,
    mealType: "Morning",
    mealDetails: {
      ingredients: ["Eggs", "Bread", "Milk"],
      instructions: "No salt, low sugar"
    },
    assignedTo: "John Doe",
    roomNumber: 101,
    status: "Assigned",
    timestamp: null
  }
];

// Get all deliveries
router.get('/', authMiddleware, (req, res) => {
  res.json(deliveries);
});

// Assign a delivery to delivery personnel
router.post('/assign', authMiddleware, (req, res) => {
  const { patientId, mealType, mealDetails, assignedTo, roomNumber } = req.body;

  const newDelivery = {
    id: deliveries.length + 1,
    patientId,
    mealType,
    mealDetails,
    assignedTo,
    roomNumber,
    status: "Assigned",
    timestamp: null
  };

  deliveries.push(newDelivery);

  res.status(201).json({
    message: 'Delivery assigned successfully',
    delivery: newDelivery
  });
});

// Mark delivery as completed
router.put('/mark-complete/:id', authMiddleware, (req, res) => {
  const deliveryId = parseInt(req.params.id);

  const delivery = deliveries.find(d => d.id === deliveryId);

  if (!delivery) {
    return res.status(404).json({ message: 'Delivery not found' });
  }

  // Mark the delivery as completed and add the timestamp
  delivery.status = "Delivered";
  delivery.timestamp = new Date();

  res.json({
    message: 'Delivery marked as completed',
    delivery
  });
});

// Get all deliveries for a specific patient
router.get('/patient/:id', authMiddleware, (req, res) => {
  const patientId = parseInt(req.params.id);

  const patientDeliveries = deliveries.filter(d => d.patientId === patientId);

  if (patientDeliveries.length === 0) {
    return res.status(404).json({ message: 'No deliveries found for this patient' });
  }

  res.json(patientDeliveries);
});

module.exports = router;
