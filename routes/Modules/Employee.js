const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String },
  salary: { type: Number },
  attendance: { type: String, enum: ["Present", "Absent", "Leave"], default: "Present" },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);