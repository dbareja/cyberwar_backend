const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId, status: 'approved', parentComment: null })
      .sort('-createdAt').lean();
    const replies = await Comment.find({ blog: blogId, status: 'approved', parentComment: { $ne: null } })
      .sort('createdAt').lean();
    res.json({ success: true, comments, replies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createComment = async (req, res) => {
  try {
    const { name, email, website, content, parentComment } = req.body;
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const comment = await Comment.create({
      blog: blogId,
      author: { name, email, website },
      content, parentComment: parentComment || null,
      ipAddress: req.ip
    });

    await Blog.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } });
    res.status(201).json({ success: true, comment, message: 'Comment submitted for review' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAdminComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const total = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate('blog', 'title slug')
      .sort('-createdAt').skip(skip).limit(limit).lean();

    res.json({ success: true, comments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateCommentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const comment = await Comment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    await Blog.findByIdAndUpdate(comment.blog, { $inc: { commentCount: -1 } });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getComments, createComment, getAdminComments, updateCommentStatus, deleteComment };
