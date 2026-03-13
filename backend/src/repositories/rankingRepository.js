const pool = require('../db/client');

const RANKING_TABLES = {
  teams_easy: 'ranking_teams_easy',
  teams_hard: 'ranking_teams_hard',
  players_easy: 'ranking_players_easy',
  players_hard: 'ranking_players_hard',
  timed_easy: 'ranking_timed_easy',
  timed_hard: 'ranking_timed_hard',
};

const getTable = (mode, difficulty) => {
  const key = `${mode}_${difficulty}`;
  const table = RANKING_TABLES[key];
  if (!table) throw new Error(`Ranking invalido: ${key}`);
  return table;
};

const rankingRepository = {
  async findByUser(userId, mode, difficulty) {
    const table = getTable(mode, difficulty);
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  },

  async upsert(userId, sessionId, correctAnswers, totalTimeMs, mode, difficulty) {
    const table = getTable(mode, difficulty);
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

  async getLeaderboard(mode, difficulty, limit = 50) {
    const table = getTable(mode, difficulty);
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