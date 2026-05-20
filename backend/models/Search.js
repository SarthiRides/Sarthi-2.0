const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupLat: Number,
  pickupLng: Number,
  dropLat: Number,
  dropLng: Number,
  rideTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'RideType' },
  distanceKm: Number,
  durationMin: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Search', searchSchema);
