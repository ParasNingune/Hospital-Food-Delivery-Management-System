const express = require('express');
const User = require('../models/User');  // Import the User model
const router = express.Router();

// Get all users
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the User collection
    res.json(users); // Send the list of users as the response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;