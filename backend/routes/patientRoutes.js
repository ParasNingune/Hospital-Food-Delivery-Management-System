const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const router = express.Router();

// Only allow "admin" role to access these routes
// router.use(authMiddleware, roleMiddleware("admin"));

// CRUD operations
router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;
