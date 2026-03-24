const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// Get all employees
router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Add employee
router.post("/", async (req, res) => {
  const { name, email, department, salary, attendance } = req.body;
  const employee = new Employee({ name, email, department, salary, attendance });
  await employee.save();
  res.status(201).json(employee);
});

// Update employee
router.put("/:id", async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(employee);
});

// Delete employee
router.delete("/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

module.exports = router;