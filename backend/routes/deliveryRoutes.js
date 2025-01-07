const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// In-memory data for delivery personnel and meal deliveries (Replace with actual DB in production)
let deliveryPersonnel = [
  {
    id: 1,
    name: "Alice Johnson",
    contactInfo: "alice.johnson@example.com",
    assignedMeals: [
      {
        mealId: 1,
        patientId: 1,
        roomNumber: 101,
        mealType: "Morning",
        status: "Assigned"
      }
    ]
  }
];

let mealDeliveries = [
  {
    mealId: 1,
    patientId: 1,
    roomNumber: 101,
    mealType: "Morning",
    mealDetails: {
      ingredients: ["Eggs", "Bread", "Milk"],
      instructions: "No salt, low sugar"
    },
    assignedTo: "Alice Johnson",
    status: "Assigned"
  }
];

// Get all delivery personnel
router.get('/', authMiddleware, (req, res) => {
  res.json(deliveryPersonnel);
});

// Add new delivery personnel
router.post('/', authMiddleware, (req, res) => {
  const { name, contactInfo } = req.body;

  const newDeliveryPersonnel = {
    id: deliveryPersonnel.length + 1,
    name,
    contactInfo,
    assignedMeals: []
  };

  deliveryPersonnel.push(newDeliveryPersonnel);

  res.status(201).json({
    message: 'Delivery personnel added successfully',
    deliveryPersonnel: newDeliveryPersonnel
  });
});

// Assign meal delivery to delivery personnel
router.post('/assign-meal', authMiddleware, (req, res) => {
  const { mealId, personnelId } = req.body;

  const personnel = deliveryPersonnel.find(d => d.id === personnelId);
  const mealDelivery = mealDeliveries.find(m => m.mealId === mealId);

  if (!personnel) {
    return res.status(404).json({ message: 'Delivery personnel not found' });
  }

  if (!mealDelivery) {
    return res.status(404).json({ message: 'Meal not found' });
  }

  mealDelivery.status = "Assigned"; // Change meal status to "Assigned"
  personnel.assignedMeals.push(mealDelivery);

  res.status(201).json({
    message: 'Meal assigned to delivery personnel',
    personnel,
    mealDelivery
  });
});

// Update delivery status (Mark as completed)
router.put('/update-status/:personnelId/:mealId', authMiddleware, (req, res) => {
  const { personnelId, mealId } = req.params;
  const { status } = req.body;

  const personnel = deliveryPersonnel.find(d => d.id === parseInt(personnelId));
  const mealDelivery = personnel?.assignedMeals.find(m => m.mealId === parseInt(mealId));

  if (!personnel || !mealDelivery) {
    return res.status(404).json({ message: 'Delivery personnel or meal delivery not found' });
  }

  mealDelivery.status = status;

  if (status === "Delivered") {
    mealDelivery.deliveryTime = new Date().toISOString();
  }

  res.json({
    message: 'Delivery status updated successfully',
    mealDelivery
  });
});

// Get all meals assigned to specific delivery personnel
router.get('/personnel/:id', authMiddleware, (req, res) => {
  const personnelId = parseInt(req.params.id);

  const personnel = deliveryPersonnel.find(d => d.id === personnelId);

  if (!personnel) {
    return res.status(404).json({ message: 'Delivery personnel not found' });
  }

  res.json(personnel.assignedMeals);
});

module.exports = router;
