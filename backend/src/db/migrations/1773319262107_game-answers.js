exports.up = (pgm) => {
  pgm.createTable('game_answers', {
    id: { type: 'serial', primaryKey: true },
    session_id: { 
      type: 'integer', 
      notNull: true,
      references: '"game_sessions"',
      onDelete: 'CASCADE'
    },
    question_ref_id: { type: 'integer', notNull: true },
    question_type: { type: 'varchar(20)', notNull: true }, // 'teams'|'players'
    answer_given: { type: 'integer', notNull: true },
    is_correct: { type: 'boolean', notNull: true },
    response_time_ms: { type: 'integer', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });

  pgm.createIndex('game_answers', 'session_id');
};

exports.down = (pgm) => {
  pgm.dropTable('game_answers');
};