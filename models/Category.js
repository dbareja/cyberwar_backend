const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, maxlength: 500 },
  color: { type: String, default: '#dc2626' },
  icon: { type: String, default: '🛡️' },
  isActive: { type: Boolean, default: true },
  blogCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
