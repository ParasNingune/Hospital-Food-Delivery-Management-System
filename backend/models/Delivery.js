const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    
    foodItems: [
      {
        itemName: String,
        quantity: Number,
      },
    ],
    deliveryTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
