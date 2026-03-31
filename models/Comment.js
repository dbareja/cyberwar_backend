const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  author: {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    website: String
  },
  content: { type: String, required: true, maxlength: 2000 },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'spam'], default: 'pending' },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  ipAddress: String,
  likes: { type: Number, default: 0 }
}, { timestamps: true });

commentSchema.index({ blog: 1, status: 1 });
commentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
