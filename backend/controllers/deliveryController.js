const Delivery = require("../models/Delivery");

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries", error });
  }
};

// Add a new delivery
exports.addDelivery = async (req, res) => {
  const { patientId, foodItems, deliveryTime, status } = req.body;

  try {
    const newDelivery = new Delivery({ patientId, foodItems, deliveryTime, status });
    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ message: "Error adding delivery", error });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  const {id} = req.params;
  const {status} = req.body;

  try {
    // Find and update the delivery by patientId
    const updatedDelivery = await Delivery.findOneAndUpdate({patientId: id}, {status}, {new: true});

    if (!updatedDelivery) {
      console.log("Delivery not found for patientId:", id);
      return res.status(404).json({ message: "Delivery not found" });
    }

    console.log("Updated Delivery:", updatedDelivery);
    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ message: "Error updating delivery status", error });
  }
};
