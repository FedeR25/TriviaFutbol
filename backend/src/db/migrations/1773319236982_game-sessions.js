exports.up = (pgm) => {
  pgm.createTable('game_sessions', {
    id: { type: 'serial', primaryKey: true },
    user_id: { 
      type: 'integer', 
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE'
    },
    mode: { type: 'varchar(20)', notNull: true },       // 'teams'|'players'|'timed'
    difficulty: { type: 'varchar(10)', notNull: true }, // 'easy'|'hard'
    correct_answers: { type: 'integer', notNull: true, default: 0 },
    wrong_answers: { type: 'integer', notNull: true, default: 0 },
    penalty_ms: { type: 'integer', notNull: true, default: 0 },
    raw_time_ms: { type: 'integer' },
    total_time_ms: { type: 'integer' },
    questions_answered: { type: 'integer', notNull: true, default: 0 },
    time_limit_ms: { type: 'integer', notNull: true, default: 60000 },
    completed: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });

  pgm.createIndex('game_sessions', 'user_id');
  pgm.createIndex('game_sessions', ['mode', 'difficulty']);
};

exports.down = (pgm) => {
  pgm.dropTable('game_sessions');
};