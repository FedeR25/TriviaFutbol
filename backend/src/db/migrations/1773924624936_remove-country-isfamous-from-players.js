exports.up = (pgm) => {
  pgm.dropColumn('players', 'country');
  pgm.dropColumn('players', 'is_famous');
};

exports.down = (pgm) => {
  pgm.addColumn('players', {
    country: { type: 'varchar(50)', notNull: true, default: 'Desconocido' },
    is_famous: { type: 'boolean', notNull: true, default: true }
  });
};