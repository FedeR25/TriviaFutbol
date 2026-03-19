const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

router.get('/:mode', rankingController.getLeaderboard);

module.exports = router;