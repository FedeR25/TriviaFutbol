exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(30)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    is_admin: { type: 'boolean', notNull: true, default: false },
    force_password_reset: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};