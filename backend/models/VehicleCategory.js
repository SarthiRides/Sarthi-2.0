const mongoose = require('mongoose');

const vehicleCategorySchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  rideTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'RideType', required: true },
  name: { type: String, required: true },
  baseFare: { type: Number, default: 0 },
  perKmRate: { type: Number, default: 0 },
  perMinRate: { type: Number, default: 0 }
});

module.exports = mongoose.model('VehicleCategory', vehicleCategorySchema);
