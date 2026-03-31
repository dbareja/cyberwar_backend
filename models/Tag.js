const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 50 },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, maxlength: 200 },
  color: { type: String, default: '#6B7280' },
  blogCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
