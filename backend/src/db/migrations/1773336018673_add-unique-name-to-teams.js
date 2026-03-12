exports.up = (pgm) => {
  pgm.addConstraint('teams', 'teams_name_unique', 'UNIQUE (name)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('teams', 'teams_name_unique');
}