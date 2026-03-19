const pool = require('../db/client');

const gameRepository = {
  async createSession(userId, mode) {
    const result = await pool.query(
      `INSERT INTO game_sessions (user_id, mode)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, mode]
    );
    return result.rows[0];
  },

  async findSessionById(id) {
    const result = await pool.query(
      'SELECT * FROM game_sessions WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async updateSession(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE game_sessions SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  },

  async createAnswer(sessionId, questionRefId, questionType, answerGiven, isCorrect, responseTimeMs) {
    const result = await pool.query(
      `INSERT INTO game_answers
       (session_id, question_ref_id, question_type, answer_given, is_correct, response_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [sessionId, questionRefId, questionType, answerGiven, isCorrect, responseTimeMs]
    );
    return result.rows[0];
  },

  async getAnswersBySession(sessionId) {
    const result = await pool.query(
      'SELECT * FROM game_answers WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );
    return result.rows;
  },

  async wasQuestionAnswered(sessionId, questionRefId) {
    const result = await pool.query(
      'SELECT id FROM game_answers WHERE session_id = $1 AND question_ref_id = $2',
      [sessionId, questionRefId]
    );
    return result.rows.length > 0;
  }
};

module.exports = gameRepository;