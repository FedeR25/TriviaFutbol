const rankingRepository = require('../repositories/rankingRepository');
const userRepository = require('../repositories/userRepository');

const rankingService = {
  async updateRanking(userId, sessionId, correctAnswers, totalTimeMs, mode) {
    const current = await rankingRepository.findByUser(userId, mode);
    const isTimed = mode === 'timed';

    let shouldUpdate = false;

    if (!current) {
      shouldUpdate = true;
    } else if (correctAnswers > current.correct_answers) {
      shouldUpdate = true;
    } else if (correctAnswers === current.correct_answers) {
      if (!isTimed && totalTimeMs < current.total_time_ms) {
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      await rankingRepository.upsert(userId, sessionId, correctAnswers, totalTimeMs, mode);
    }

    const leaderboard = await rankingRepository.getLeaderboard(mode);
    const user = await userRepository.findById(userId);
    const position = leaderboard.findIndex(row => row.username === user.username);

    return position >= 0 ? position + 1 : null;
  },

  async getLeaderboard(mode) {
    return rankingRepository.getLeaderboard(mode);
  }
};

module.exports = rankingService;