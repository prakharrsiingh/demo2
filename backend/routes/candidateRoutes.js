const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.getAllCandidates);
router.post('/', candidateController.addCandidate);

module.exports = router;
