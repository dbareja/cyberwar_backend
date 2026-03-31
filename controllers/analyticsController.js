const Visitor = require('../models/Visitor');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const Newsletter = require('../models/Newsletter');
const { v4: uuidv4 } = require('uuid');

const trackVisitor = async (req, res) => {
  try {
    const { page, blogId, duration, sessionId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    let browser = 'Unknown', os = 'Unknown', device = 'Desktop';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iOS')) os = 'iOS';

    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) device = 'Mobile';
    else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) device = 'Tablet';

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const existingVisit = await Visitor.findOne({ ipAddress, page, date: { $gte: today } });

    const visitor = await Visitor.create({
      sessionId: sessionId || uuidv4(), ipAddress, page, userAgent,
      browser, os, device, blog: blogId || null,
      isUnique: !existingVisit, duration: duration || 0,
      referrer: req.headers.referer || '', date: new Date()
    });

    res.status(201).json({ success: true, sessionId: visitor.sessionId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalBlogs, publishedBlogs, draftBlogs, totalUsers, totalComments, pendingComments,
      totalVisitors, uniqueVisitors, newsletterSubs] = await Promise.all([
      Blog.countDocuments(), Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }), User.countDocuments(),
      Comment.countDocuments(), Comment.countDocuments({ status: 'pending' }),
      Visitor.countDocuments(), Visitor.countDocuments({ isUnique: true }),
      Newsletter.countDocuments({ isActive: true })
    ]);

    const viewsAgg = await Blog.aggregate([{ $group: { _id: null, total: { $sum: '$viewCount' } } }]);
    const totalBlogViews = viewsAgg[0]?.total || 0;

    res.json({
      success: true, stats: {
        totalBlogs, publishedBlogs, draftBlogs, totalUsers,
        totalComments, pendingComments, totalVisitors,
        uniqueVisitors, totalBlogViews, newsletterSubs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getVisitorStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const visitorData = await Visitor.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } }, total: { $sum: 1 }, unique: { $sum: { $cond: ['$isUnique', 1, 0] } } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const formatted = visitorData.map(d => ({
      date: `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`,
      total: d.total, unique: d.unique
    }));

    const browserStats = await Visitor.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const deviceStats = await Visitor.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, visitors: formatted, browserStats, deviceStats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getBlogViewStats = async (req, res) => {
  try {
    const topBlogs = await Blog.find({ status: 'published' })
      .select('title slug viewCount commentCount publishedAt')
      .sort('-viewCount').limit(10).lean();
    res.json({ success: true, topBlogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) return res.status(400).json({ success: false, message: 'Already subscribed' });
      existing.isActive = true;
      await existing.save();
      return res.json({ success: true, message: 'Successfully resubscribed!' });
    }
    await Newsletter.create({ email, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort('-subscribedAt');
    res.json({ success: true, subscribers, total: subscribers.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { trackVisitor, getDashboardStats, getVisitorStats, getBlogViewStats, subscribeNewsletter, getNewsletterSubscribers };
