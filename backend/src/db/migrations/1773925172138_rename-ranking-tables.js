exports.up = (pgm) => {
  // Crear las 3 tablas nuevas
  pgm.createTable('ranking_teams', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', unique: true, notNull: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    total_time_ms: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()'), notNull: true }
  });

  pgm.createTable('ranking_players', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', unique: true, notNull: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    total_time_ms: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()'), notNull: true }
  });

  pgm.createTable('ranking_timed', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', unique: true, notNull: true, references: '"users"', onDelete: 'CASCADE' },
    best_session_id: { type: 'integer', references: '"game_sessions"', onDelete: 'SET NULL' },
    correct_answers: { type: 'integer', notNull: true },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()'), notNull: true }
  });

  // Eliminar las 6 tablas viejas
  pgm.dropTable('ranking_teams_easy');
  pgm.dropTable('ranking_teams_hard');
  pgm.dropTable('ranking_players_easy');
  pgm.dropTable('ranking_players_hard');
  pgm.dropTable('ranking_timed_easy');
  pgm.dropTable('ranking_timed_hard');
};

exports.down = (pgm) => {
  pgm.dropTable('ranking_teams');
  pgm.dropTable('ranking_players');
  pgm.dropTable('ranking_timed');
};