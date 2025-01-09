const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const userRoutes = require('./routes/userRoutes');
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use('/api/users', userRoutes); 

app.get("/", (req, res) => {
  res.send("Welcome to Hospital Food Delivery Management API!");
});

module.exports = app;
