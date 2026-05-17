const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.getAllCandidates);
router.post('/', candidateController.addCandidate);
router.put('/:id/shortlist', candidateController.toggleShortlist);

module.exports = router;
