const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, maxlength: 2000 },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  type: { type: String, enum: ['ransomware', 'apt', 'phishing', 'malware', 'ddos', 'zero-day', 'supply-chain', 'insider', 'other'], default: 'other' },
  affectedSystems: { type: String, maxlength: 500 },
  mitigationSteps: { type: String, maxlength: 2000 },
  status: { type: String, enum: ['active', 'mitigated', 'resolved', 'monitoring'], default: 'active' },
  firstDetected: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#dc2626' },
  icon: { type: String, default: '🚨' }
}, { timestamps: true });

module.exports = mongoose.model('Threat', threatSchema);
