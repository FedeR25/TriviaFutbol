const rankingRepository = require('../repositories/rankingRepository');
const userRepository = require('../repositories/userRepository');

const rankingService = {
  async updateRanking(userId, sessionId, correctAnswers, totalTimeMs, mode, difficulty) {
    const current = await rankingRepository.findByUser(userId, mode, difficulty);
    const isTimed = mode === 'timed';

    let shouldUpdate = false;

    if (!current) {
      shouldUpdate = true;
    } else if (correctAnswers > current.correct_answers) {
      shouldUpdate = true;
    } else if (correctAnswers === current.correct_answers) {
      if (isTimed) {
        shouldUpdate = false;
      } else if (totalTimeMs < current.total_time_ms) {
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      await rankingRepository.upsert(
        userId, sessionId, correctAnswers, totalTimeMs, mode, difficulty
      );
    }

    // Obtener posición en el ranking
    const leaderboard = await rankingRepository.getLeaderboard(mode, difficulty);
    const user = await userRepository.findById(userId);
    const position = leaderboard.findIndex(row => row.username === user.username);

    return position >= 0 ? position + 1 : null;
  },

  async getLeaderboard(mode, difficulty) {
    return rankingRepository.getLeaderboard(mode, difficulty);
  }
};

module.exports = rankingService;