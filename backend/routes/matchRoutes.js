const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/match', matchController.matchCandidates);
router.post('/ai/shortlist', matchController.aiShortlist);

module.exports = router;
