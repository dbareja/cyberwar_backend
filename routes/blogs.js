const express = require('express');
const router = express.Router();
const { getBlogs, getFeaturedBlogs, getTrendingBlogs, getBreakingBlogs, getRelatedBlogs, getBlogBySlug, getLatestBlogs } = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/latest', getLatestBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/breaking', getBreakingBlogs);
router.get('/:id/related', getRelatedBlogs);
router.get('/slug/:slug', getBlogBySlug);

module.exports = router;
