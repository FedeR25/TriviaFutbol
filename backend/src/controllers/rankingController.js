const rankingService = require('../services/rankingService');

const rankingController = {
  async getLeaderboard(req, res, next) {
    try {
      const { mode } = req.params;

      const validModes = ['teams', 'players', 'timed'];

      if (!validModes.includes(mode)) {
        return res.status(400).json({ error: { message: 'Modo inválido' } });
      }

      const leaderboard = await rankingService.getLeaderboard(mode);
      res.json({ leaderboard });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = rankingController;