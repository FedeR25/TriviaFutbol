const rankingRepository = require('../repositories/rankingRepository');

const rankingService = {
  async updateRanking(userId, sessionId, correctAnswers, totalTimeMs, mode) {
    // Ya no necesitamos actualizar tablas de ranking
    // El ranking se calcula directo desde game_sessions
    return null;
  },

  async getLeaderboard(mode) {
    return rankingRepository.getLeaderboard(mode);
  }
};

module.exports = rankingService;