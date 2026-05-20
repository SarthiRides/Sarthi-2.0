const mongoose = require('mongoose');

const fareResultSchema = new mongoose.Schema({
  searchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Search', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  vehicleCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleCategory' },
  estimatedFare: Number,
  estimatedTimeMin: Number
});

module.exports = mongoose.model('FareResult', fareResultSchema);
