const pool = require('../db/client');

const rankingRepository = {
  async getLeaderboard(mode, limit = 25) {
    const isTimed = mode === 'timed';

    if (isTimed) {
      const result = await pool.query(
        `SELECT
           u.username,
           gs.correct_answers,
           gs.created_at,
           RANK() OVER (ORDER BY gs.correct_answers DESC) AS position
         FROM game_sessions gs
         JOIN users u ON u.id = gs.user_id
         WHERE gs.mode = $1 AND gs.completed = true
         ORDER BY gs.correct_answers DESC
         LIMIT $2`,
        [mode, limit]
      );
      return result.rows;
    } else {
      const result = await pool.query(
        `SELECT
           u.username,
           gs.correct_answers,
           gs.total_time_ms,
           gs.created_at,
           RANK() OVER (ORDER BY gs.correct_answers DESC, gs.total_time_ms ASC) AS position
         FROM game_sessions gs
         JOIN users u ON u.id = gs.user_id
         WHERE gs.mode = $1 AND gs.completed = true
         ORDER BY gs.correct_answers DESC, gs.total_time_ms ASC
         LIMIT $2`,
        [mode, limit]
      );
      return result.rows;
    }
  }
};

module.exports = rankingRepository;