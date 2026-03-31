const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, unique: true, lowercase: true },
  excerpt: { type: String, maxlength: 500 },
  content: { type: String, required: true },
  featuredImage: { type: String, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBreaking: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  readTime: { type: Number, default: 5 },
  metaTitle: { type: String, maxlength: 70 },
  metaDescription: { type: String, maxlength: 160 },
  publishedAt: { type: Date },
  scheduledAt: { type: Date }
}, { timestamps: true });

blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ isTrending: 1 });

blogSchema.pre('save', async function(next) {
  if (!this.slug && this.title) {
    const slugify = require('slugify');
    let slug = slugify(this.title, { lower: true, strict: true, trim: true });
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await this.constructor.findOne({ slug: uniqueSlug, _id: { $ne: this._id } });
      if (!existing) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    this.slug = uniqueSlug;
  }
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
