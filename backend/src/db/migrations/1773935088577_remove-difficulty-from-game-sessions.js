exports.up = (pgm) => {
  pgm.dropColumn('game_sessions', 'difficulty');
};

exports.down = (pgm) => {
  pgm.addColumn('game_sessions', {
    difficulty: { type: 'varchar(10)', notNull: true, default: 'easy' }
  });
};