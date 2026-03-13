const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const { rankingLimiter } = require('../middlewares/rateLimiter');

router.get('/:mode/:difficulty', rankingLimiter, rankingController.getLeaderboard);

module.exports = router;