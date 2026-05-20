const mongoose = require('mongoose');

const rideTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ['bike', 'auto', 'cab', 'parcel', 'rental'],
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RideType', rideTypeSchema);
