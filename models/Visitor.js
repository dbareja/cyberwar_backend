const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  ipAddress: String,
  page: String,
  userAgent: String,
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Desktop' },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', default: null },
  isUnique: { type: Boolean, default: true },
  duration: { type: Number, default: 0 },
  referrer: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

visitorSchema.index({ date: -1 });
visitorSchema.index({ ipAddress: 1, page: 1, date: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);
