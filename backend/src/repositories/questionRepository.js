const pool = require('../db/client');

const questionRepository = {
  async getRandomTeams(limit) {
    const result = await pool.query(
      `SELECT id, name, league, country, division, logo_url
       FROM teams
       ORDER BY RANDOM()
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async getRandomPlayers(limit) {
    const result = await pool.query(
      `SELECT p.id, p.name, p.photo_url, t.name as team_name, t.id as team_id, t.league, t.division, t.country
       FROM players p
       JOIN teams t ON t.id = p.team_id
       WHERE t.id IS NOT NULL
       ORDER BY RANDOM()
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async getWrongTeamOptions(excludeId, league, division, limit) {
    const result = await pool.query(
      `SELECT id, name, logo_url
       FROM teams
       WHERE id != $1 AND league = $2 AND division = $3
       ORDER BY RANDOM()
       LIMIT $4`,
      [excludeId, league, division, limit]
    );
    return result.rows;
  },

  async getWrongTeamOptionsFallback(excludeId, country, limit) {
    const result = await pool.query(
      `SELECT id, name, logo_url
       FROM teams
       WHERE id != $1 AND country = $2
       ORDER BY RANDOM()
       LIMIT $3`,
      [excludeId, country, limit]
    );
    return result.rows;
  }
};

module.exports = questionRepository;