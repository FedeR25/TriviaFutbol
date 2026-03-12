exports.up = (pgm) => {
  pgm.createTable('teams', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(100)', notNull: true },
    league: { type: 'varchar(50)', notNull: true },
    country: { type: 'varchar(50)', notNull: true },
    division: { type: 'varchar(10)', notNull: true }, // 'primera' | 'segunda'
    logo_url: { type: 'varchar(500)' },
    external_id: { type: 'integer' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });

  pgm.createIndex('teams', 'league');
  pgm.createIndex('teams', 'division');
};

exports.down = (pgm) => {
  pgm.dropTable('teams');
};