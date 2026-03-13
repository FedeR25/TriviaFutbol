const rankingService = require('../services/rankingService');

const rankingController = {
  async getLeaderboard(req, res, next) {
    try {
      const { mode, difficulty } = req.params;

      const validModes = ['teams', 'players', 'timed'];
      const validDifficulties = ['easy', 'hard'];

      if (!validModes.includes(mode)) {
        return res.status(400).json({ error: { message: 'Modo inválido' } });
      }
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({ error: { message: 'Dificultad inválida' } });
      }

      const leaderboard = await rankingService.getLeaderboard(mode, difficulty);
      res.json({ leaderboard });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = rankingController;