const express = require('express');
const router = express.Router();
const { getThreats, getThreatById, getThreatStats } = require('../controllers/threatController');

router.get('/', getThreats);
router.get('/stats', getThreatStats);
router.get('/:id', getThreatById);

module.exports = router;
