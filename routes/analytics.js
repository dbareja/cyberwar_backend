const express = require('express');
const router = express.Router();
const { trackVisitor, subscribeNewsletter } = require('../controllers/analyticsController');

router.post('/track', trackVisitor);
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;
