const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: { type: String, required: true },
  predictedRevenue: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Sale", saleSchema);