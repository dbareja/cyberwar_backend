const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const slugify = require('slugify');

const generateSlug = async (title, excludeId = null) => {
  let slug = slugify(title, { lower: true, strict: true, trim: true });
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const query = { slug: uniqueSlug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Blog.findOne(query);
    if (!existing) break;
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};

// Public
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { category, tag, search, sort } = req.query;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug color')
      .sort(sort || '-publishedAt')
      .skip(skip).limit(limit).lean();

    res.json({ success: true, blogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published', isFeatured: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort('-publishedAt').limit(6).lean();
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getLatestBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .sort('-publishedAt').limit(4).lean();
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .sort('-viewCount').limit(8).lean();
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getBreakingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published', isBreaking: true })
      .populate('category', 'name slug color')
      .sort('-publishedAt').limit(5).lean();
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getRelatedBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    const related = await Blog.find({
      status: 'published', _id: { $ne: blog._id },
      $or: [{ category: blog.category }, { tags: { $in: blog.tags } }]
    }).populate('author', 'name avatar').populate('category', 'name slug color').sort('-viewCount').limit(4).lean();
    res.json({ success: true, blogs: related });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar bio social')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug color').lean();
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    await Blog.findByIdAndUpdate(blog._id, { $inc: { viewCount: 1 } });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin
const getAdminBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort('-createdAt').skip(skip).limit(limit).lean();

    res.json({ success: true, blogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAdminBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar').populate('category', 'name slug').populate('tags', 'name slug');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status, isFeatured, isTrending, isBreaking, metaTitle, metaDescription, scheduledAt } = req.body;
    const slug = await generateSlug(title);
    const blogData = {
      title, slug, content, excerpt,
      category: category || null,
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      status: status || 'draft',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isTrending: isTrending === 'true' || isTrending === true,
      isBreaking: isBreaking === 'true' || isBreaking === true,
      metaTitle, metaDescription, author: req.user.id
    };
    if (req.file) blogData.featuredImage = `/uploads/${req.file.filename}`;
    if (scheduledAt) blogData.scheduledAt = new Date(scheduledAt);
    if (status === 'published') blogData.publishedAt = new Date();

    const blog = await Blog.create(blogData);
    if (category) await Category.findByIdAndUpdate(category, { $inc: { blogCount: 1 } });
    if (blogData.tags.length > 0) await Tag.updateMany({ _id: { $in: blogData.tags } }, { $inc: { blogCount: 1 } });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const { title, content, excerpt, category, tags, status, isFeatured, isTrending, isBreaking, metaTitle, metaDescription } = req.body;
    const updateData = {
      title, content, excerpt, category: category || null,
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      status, isFeatured: isFeatured === 'true' || isFeatured === true,
      isTrending: isTrending === 'true' || isTrending === true,
      isBreaking: isBreaking === 'true' || isBreaking === true,
      metaTitle, metaDescription
    };

    if (title && title !== existingBlog.title) updateData.slug = await generateSlug(title, req.params.id);
    if (req.file) updateData.featuredImage = `/uploads/${req.file.filename}`;
    if (status === 'published' && existingBlog.status !== 'published') updateData.publishedAt = new Date();

    if (existingBlog.category && existingBlog.category.toString() !== category) {
      await Category.findByIdAndUpdate(existingBlog.category, { $inc: { blogCount: -1 } });
      if (category) await Category.findByIdAndUpdate(category, { $inc: { blogCount: 1 } });
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('author', 'name avatar').populate('category', 'name slug').populate('tags', 'name slug');

    res.json({ success: true, blog });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.category) await Category.findByIdAndUpdate(blog.category, { $inc: { blogCount: -1 } });
    if (blog.tags.length > 0) await Tag.updateMany({ _id: { $in: blog.tags } }, { $inc: { blogCount: -1 } });
    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.status = blog.status === 'published' ? 'draft' : 'published';
    if (blog.status === 'published' && !blog.publishedAt) blog.publishedAt = new Date();
    await blog.save();
    res.json({ success: true, blog, message: `Blog ${blog.status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const generateSlugFromTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const slug = await generateSlug(title);
    res.json({ success: true, slug });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getBlogs, getFeaturedBlogs, getLatestBlogs, getTrendingBlogs, getBreakingBlogs, getRelatedBlogs, getBlogBySlug, getAdminBlogs, getAdminBlogById, createBlog, updateBlog, deleteBlog, toggleStatus, generateSlugFromTitle };
