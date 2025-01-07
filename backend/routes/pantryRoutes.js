const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// In-memory data for pantry staff and tasks (Replace with actual DB in production)
let pantryStaff = [
  {
    id: 1,
    name: "John Doe",
    contactInfo: "john.doe@example.com",
    location: "Pantry 1",
    assignedTasks: [
      {
        mealId: 1,
        task: "Prepare Morning Meal",
        status: "In Progress"
      }
    ]
  }
];

let mealTasks = [
  {
    mealId: 1,
    patientId: 1,
    mealType: "Morning",
    mealDetails: {
      ingredients: ["Eggs", "Bread", "Milk"],
      instructions: "No salt, low sugar"
    },
    assignedTo: "John Doe",
    status: "Assigned"
  }
];

// Get all pantry staff
router.get('/', authMiddleware, (req, res) => {
  res.json(pantryStaff);
});

// Add new pantry staff
router.post('/', authMiddleware, (req, res) => {
  const { name, contactInfo, location } = req.body;

  const newStaff = {
    id: pantryStaff.length + 1,
    name,
    contactInfo,
    location,
    assignedTasks: []
  };

  pantryStaff.push(newStaff);

  res.status(201).json({
    message: 'Pantry staff added successfully',
    staff: newStaff
  });
});

// Assign task to pantry staff
router.post('/assign-task', authMiddleware, (req, res) => {
  const { mealId, staffId, task } = req.body;

  const staff = pantryStaff.find(s => s.id === staffId);
  const mealTask = mealTasks.find(m => m.mealId === mealId);

  if (!staff) {
    return res.status(404).json({ message: 'Pantry staff not found' });
  }

  if (!mealTask) {
    return res.status(404).json({ message: 'Meal not found' });
  }

  const newTask = {
    mealId,
    task,
    status: "Assigned"
  };

  staff.assignedTasks.push(newTask);
  mealTask.status = "In Progress"; // Change meal task status to "In Progress"

  res.status(201).json({
    message: 'Task assigned to pantry staff',
    staff,
    task: newTask
  });
});

// Update preparation status of pantry staff task
router.put('/update-status/:staffId/:mealId', authMiddleware, (req, res) => {
  const { staffId, mealId } = req.params;
  const { status } = req.body;

  const staff = pantryStaff.find(s => s.id === parseInt(staffId));
  const task = staff?.assignedTasks.find(t => t.mealId === parseInt(mealId));

  if (!staff || !task) {
    return res.status(404).json({ message: 'Staff or task not found' });
  }

  task.status = status;

  // If task is completed, update meal status
  if (status === "Completed") {
    const mealTask = mealTasks.find(m => m.mealId === parseInt(mealId));
    mealTask.status = "Prepared";
  }

  res.json({
    message: 'Task status updated successfully',
    task
  });
});

// Get all tasks for a specific pantry staff member
router.get('/staff/:id', authMiddleware, (req, res) => {
  const staffId = parseInt(req.params.id);

  const staff = pantryStaff.find(s => s.id === staffId);

  if (!staff) {
    return res.status(404).json({ message: 'Pantry staff not found' });
  }

  res.json(staff.assignedTasks);
});

module.exports = router;
