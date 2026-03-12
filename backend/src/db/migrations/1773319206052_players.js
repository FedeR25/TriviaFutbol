exports.up = (pgm) => {
  pgm.createTable('players', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(100)', notNull: true },
    team_id: { 
      type: 'integer', 
      references: '"teams"',
      onDelete: 'SET NULL'
    },
    league: { type: 'varchar(50)', notNull: true },
    country: { type: 'varchar(50)', notNull: true },
    photo_url: { type: 'varchar(500)' },
    is_famous: { type: 'boolean', notNull: true, default: true },
    external_id: { type: 'integer' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });

  pgm.createIndex('players', 'team_id');
  pgm.createIndex('players', 'is_famous');
};

exports.down = (pgm) => {
  pgm.dropTable('players');
};