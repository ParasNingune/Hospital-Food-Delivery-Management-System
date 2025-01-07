const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Register Route
router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  registerUser
);

// Login Route
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginUser
);

module.exports = router;
