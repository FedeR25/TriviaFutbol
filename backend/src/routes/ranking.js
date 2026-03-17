const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

router.get('/:mode/:difficulty', rankingController.getLeaderboard);

module.exports = router;