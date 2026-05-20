const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: String,
  appScheme: String,
  playStoreUrl: String,
  supportsBike: { type: Boolean, default: false },
  supportsAuto: { type: Boolean, default: false },
  supportsCab: { type: Boolean, default: false },
  supportsParcel: { type: Boolean, default: false },
  supportsRental: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);
