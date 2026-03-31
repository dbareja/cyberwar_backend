const express = require('express');
const router = express.Router();
const { getExternalLinks, trackClick } = require('../controllers/externalLinkController');
const { fetchOGMetadata } = require('../controllers/ogMetadataController');

router.get('/', getExternalLinks);
router.get('/og-metadata', fetchOGMetadata);
router.post('/:id/click', trackClick);

module.exports = router;
