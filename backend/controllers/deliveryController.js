const Delivery = require("../models/Delivery");
const Patient = require("../models/Patient")

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    console.log(deliveries);
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries", error });
  }
};

// Add a new delivery
exports.addDelivery = async (req, res) => {
  const { patientId, foodItems, deliveryTime, status } = req.body;

  try {
    if (!patientId) {
      return res.status(400).json({ message: "patientId is required" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const newDelivery = await Delivery.create({
      patientId,
      foodItems,
      deliveryTime,
      status,
    });

    const response = {
      ...newDelivery._doc,
      patientName: patient.name,
    };

    res.status(201).json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to add delivery", error });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  const {id} = req.params;
  const {status} = req.body;

  try {
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
