const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// In-memory data for diet charts (Replace with actual DB in production)
let dietCharts = [
  {
    id: 1,
    patientId: 1,
    morningMeal: {
      ingredients: ["Eggs", "Bread", "Milk"],
      instructions: "No salt, low sugar"
    },
    eveningMeal: {
      ingredients: ["Rice", "Chicken", "Vegetables"],
      instructions: "No spicy"
    },
    nightMeal: {
      ingredients: ["Soup", "Crackers"],
      instructions: "Low fat"
    }
  }
];

// Get a patient's diet chart
router.get('/patient/:id', authMiddleware, (req, res) => {
  const patientId = parseInt(req.params.id);

  const dietChart = dietCharts.find(dc => dc.patientId === patientId);

  if (!dietChart) {
    return res.status(404).json({ message: 'Diet chart not found for this patient' });
  }

  res.json(dietChart);
});

// Create or update a diet chart for a patient
router.post('/patient/:id', authMiddleware, (req, res) => {
  const patientId = parseInt(req.params.id);
  const { morningMeal, eveningMeal, nightMeal } = req.body;

  // Check if a diet chart already exists for this patient
  let dietChart = dietCharts.find(dc => dc.patientId === patientId);

  if (dietChart) {
    // Update existing diet chart
    dietChart.morningMeal = morningMeal;
    dietChart.eveningMeal = eveningMeal;
    dietChart.nightMeal = nightMeal;

    return res.json({
      message: 'Diet chart updated successfully',
      dietChart
    });
  }

  // If diet chart doesn't exist, create a new one
  dietChart = {
    id: dietCharts.length + 1, // Auto-increment ID (or use a database to handle this)
    patientId,
    morningMeal,
    eveningMeal,
    nightMeal
  };

  dietCharts.push(dietChart);

  res.status(201).json({
    message: 'Diet chart created successfully',
    dietChart
  });
});

// Delete a diet chart for a patient
router.delete('/patient/:id', authMiddleware, (req, res) => {
  const patientId = parseInt(req.params.id);

  const index = dietCharts.findIndex(dc => dc.patientId === patientId);

  if (index === -1) {
    return res.status(404).json({ message: 'Diet chart not found for this patient' });
  }

  // Delete the diet chart
  dietCharts.splice(index, 1);

  res.json({ message: 'Diet chart deleted successfully' });
});

module.exports = router;
