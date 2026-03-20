const pool = require('../db/client');

const RANKING_TABLES = {
  teams: 'ranking_teams',
  players: 'ranking_players',
  timed: 'ranking_timed',
};

const getTable = (mode) => {
  const table = RANKING_TABLES[mode];
  if (!table) throw new Error(`Ranking inválido: ${mode}`);
  return table;
};

const rankingRepository = {
  async findByUser(userId, mode) {
    const table = getTable(mode);
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  },

  async upsert(userId, sessionId, correctAnswers, totalTimeMs, mode) {
    const table = getTable(mode);
    const isTimed = mode === 'timed';

    if (isTimed) {
      await pool.query(
        `INSERT INTO ${table} (user_id, best_session_id, correct_answers)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO UPDATE SET
           best_session_id = EXCLUDED.best_session_id,
           correct_answers = EXCLUDED.correct_answers,
           updated_at = NOW()`,
        [userId, sessionId, correctAnswers]
      );
    } else {
      await pool.query(
        `INSERT INTO ${table} (user_id, best_session_id, correct_answers, total_time_ms)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO UPDATE SET
           best_session_id = EXCLUDED.best_session_id,
           correct_answers = EXCLUDED.correct_answers,
           total_time_ms = EXCLUDED.total_time_ms,
           updated_at = NOW()`,
        [userId, sessionId, correctAnswers, totalTimeMs]
      );
    }
  },

  async getLeaderboard(mode, limit = 25) {
    const table = getTable(mode);
    const isTimed = mode === 'timed';

    if (isTimed) {
      const result = await pool.query(
        `SELECT
           u.username,
           r.correct_answers,
           RANK() OVER (ORDER BY r.correct_answers DESC) AS position
         FROM ${table} r
         JOIN users u ON u.id = r.user_id
         ORDER BY r.correct_answers DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } else {
      const result = await pool.query(
        `SELECT
           u.username,
           r.correct_answers,
           r.total_time_ms,
           RANK() OVER (ORDER BY r.correct_answers DESC, r.total_time_ms ASC) AS position
         FROM ${table} r
         JOIN users u ON u.id = r.user_id
         ORDER BY r.correct_answers DESC, r.total_time_ms ASC
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    }
  }
};

module.exports = rankingRepository;