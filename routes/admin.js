const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Blog routes
const { getAdminBlogs, getAdminBlogById, createBlog, updateBlog, deleteBlog, toggleStatus, generateSlugFromTitle } = require('../controllers/blogController');
router.get('/blogs', protect, getAdminBlogs);
router.get('/blogs/:id', protect, getAdminBlogById);
router.post('/blogs', protect, upload.single('featuredImage'), createBlog);
router.put('/blogs/:id', protect, upload.single('featuredImage'), updateBlog);
router.delete('/blogs/:id', protect, deleteBlog);
router.put('/blogs/:id/toggle-status', protect, toggleStatus);
router.post('/blogs/generate-slug', protect, generateSlugFromTitle);

// Category routes
const { getAdminCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
router.get('/categories', protect, getAdminCategories);
router.post('/categories', protect, createCategory);
router.put('/categories/:id', protect, updateCategory);
router.delete('/categories/:id', protect, deleteCategory);

// Threat routes
const { getAdminThreats, createThreat, updateThreat, deleteThreat } = require('../controllers/threatController');
router.get('/threats', protect, getAdminThreats);
router.post('/threats', protect, createThreat);
router.put('/threats/:id', protect, updateThreat);
router.delete('/threats/:id', protect, deleteThreat);

// Threat Stats routes
const { getThreatStats, updateThreatStats } = require('../controllers/threatController');
router.get('/threat-stats', protect, getThreatStats);
router.put('/threat-stats', protect, updateThreatStats);

// Tag routes
const { createTag, updateTag, deleteTag } = require('../controllers/tagController');
router.post('/tags', protect, createTag);
router.put('/tags/:id', protect, updateTag);
router.delete('/tags/:id', protect, deleteTag);

// Comment routes
const { getAdminComments, updateCommentStatus, deleteComment } = require('../controllers/commentController');
router.get('/comments', protect, getAdminComments);
router.put('/comments/:id', protect, updateCommentStatus);
router.delete('/comments/:id', protect, deleteComment);

// External Link routes
const { getAdminExternalLinks, createExternalLink, updateExternalLink, deleteExternalLink } = require('../controllers/externalLinkController');
router.get('/external-links', protect, getAdminExternalLinks);
router.post('/external-links', protect, createExternalLink);
router.put('/external-links/:id', protect, updateExternalLink);
router.delete('/external-links/:id', protect, deleteExternalLink);

// Analytics routes
const { getDashboardStats, getVisitorStats, getBlogViewStats, getNewsletterSubscribers } = require('../controllers/analyticsController');
router.get('/analytics/dashboard', protect, getDashboardStats);
router.get('/analytics/visitors', protect, getVisitorStats);
router.get('/analytics/blog-views', protect, getBlogViewStats);
router.get('/newsletter', protect, getNewsletterSubscribers);

module.exports = router;
