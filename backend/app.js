const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const dietChartRoutes = require("./routes/dietChartRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes"); // Add this import
const pantryRoutes = require("./routes/pantryRoutes");
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
app.use("/api/diet-charts", dietChartRoutes);
app.use("/api/deliveries", deliveryRoutes); // Add this line to use the delivery routes
app.use("/api/pantry", pantryRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Hospital Food Delivery Management API!");
});

module.exports = app;
