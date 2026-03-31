const mongoose = require('mongoose');

const externalLinkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  url: { type: String, required: true, trim: true },
  category: { type: String, enum: ['news', 'tools', 'resources', 'government', 'education', 'community'], default: 'resources' },
  icon: { type: String, default: '🔗' },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ExternalLink', externalLinkSchema);
