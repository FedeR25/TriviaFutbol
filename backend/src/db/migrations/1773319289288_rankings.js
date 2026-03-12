exports.up = (pgm) => {
  pgm.createTable('ranking_teams_easy', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    total_time_ms: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });
  pgm.createTable('ranking_teams_hard', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    total_time_ms: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });
  pgm.createTable('ranking_players_easy', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    total_time_ms: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });
  pgm.createTable('ranking_players_hard', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    total_time_ms: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });
  pgm.createTable('ranking_timed_easy', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });
  pgm.createTable('ranking_timed_hard', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });
  pgm.createIndex('ranking_teams_easy', ['correct_answers', 'total_time_ms']);
  pgm.createIndex('ranking_teams_hard', ['correct_answers', 'total_time_ms']);
  pgm.createIndex('ranking_players_easy', ['correct_answers', 'total_time_ms']);
  pgm.createIndex('ranking_players_hard', ['correct_answers', 'total_time_ms']);
  pgm.createIndex('ranking_timed_easy', ['correct_answers']);
  pgm.createIndex('ranking_timed_hard', ['correct_answers']);
};

exports.down = (pgm) => {
  pgm.dropTable('ranking_timed_hard');
  pgm.dropTable('ranking_timed_easy');
  pgm.dropTable('ranking_players_hard');
  pgm.dropTable('ranking_players_easy');
  pgm.dropTable('ranking_teams_hard');
  pgm.dropTable('ranking_teams_easy');
};