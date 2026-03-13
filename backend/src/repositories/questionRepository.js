const pool = require('../db/client');

const questionRepository = {
  async getRandomTeams(division, limit, excludeIds = []) {
    const excludeClause = excludeIds.length > 0
      ? `AND id NOT IN (${excludeIds.join(',')})`
      : '';

    const result = await pool.query(
      `SELECT id, name, league, country, logo_url
       FROM teams
       WHERE division = $1 ${excludeClause}
       ORDER BY RANDOM()
       LIMIT $2`,
      [division, limit]
    );
    return result.rows;
  },

  async getRandomTeamsExcluding(excludeIds = [], limit) {
    const excludeClause = excludeIds.length > 0
      ? `WHERE id NOT IN (${excludeIds.join(',')})`
      : '';

    const result = await pool.query(
      `SELECT id, name, league, country, logo_url
       FROM teams ${excludeClause}
       ORDER BY RANDOM()
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async getRandomPlayers(isFamous, limit, excludeIds = []) {
    const excludeClause = excludeIds.length > 0
      ? `AND p.id NOT IN (${excludeIds.join(',')})`
      : '';

    const famousClause = isFamous ? 'AND p.is_famous = true' : '';

    const result = await pool.query(
      `SELECT p.id, p.name, p.photo_url, p.country, t.name as team_name, t.id as team_id
       FROM players p
       LEFT JOIN teams t ON t.id = p.team_id
       WHERE t.id IS NOT NULL ${famousClause} ${excludeClause}
       ORDER BY RANDOM()
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async getRandomTeamsAsOptions(excludeId, limit) {
    const result = await pool.query(
      `SELECT id, name, logo_url
       FROM teams
       WHERE id != $1
       ORDER BY RANDOM()
       LIMIT $2`,
      [excludeId, limit]
    );
    return result.rows;
  },

  async getRandomTeamsAsPlayerOptions(excludeTeamId, limit) {
    const result = await pool.query(
      `SELECT id, name, logo_url
       FROM teams
       WHERE id != $1
       ORDER BY RANDOM()
       LIMIT $2`,
      [excludeTeamId, limit]
    );
    return result.rows;
  }
};

module.exports = questionRepository;