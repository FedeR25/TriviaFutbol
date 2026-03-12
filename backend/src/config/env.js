require('dotenv').config();

const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'COOKIE_SECRET'
];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Variable de entorno faltante: ${key}`);
  }
});

module.exports = {
  NODE_ENV:       process.env.NODE_ENV || 'development',
  PORT:           process.env.PORT || 3000,
  DATABASE_URL:   process.env.DATABASE_URL,
  JWT_SECRET:     process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET:  process.env.COOKIE_SECRET,
};