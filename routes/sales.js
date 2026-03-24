const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");

// Get all sales predictions
router.get("/", async (req, res) => {
  const sales = await Sale.find();
  res.json(sales);
});

// Add sales prediction
router.post("/", async (req, res) => {
  const sale = new Sale(req.body);
  await sale.save();
  res.status(201).json(sale);
});

// Update sales prediction
router.put("/:id", async (req, res) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(sale);
});

// Delete sales prediction
router.delete("/:id", async (req, res) => {
  await Sale.findByIdAndDelete(req.params.id);
  res.json({ message: "Sale prediction deleted" });
});

module.exports = router;