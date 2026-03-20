const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  const res = await pool.query(
    "SELECT name, logo_url FROM teams WHERE logo_url NOT LIKE '%r2.thesportsdb.com%' ORDER BY name"
  );
  console.log('Rotos:', res.rows.length);
  res.rows.forEach(t => console.log(t.name));
  await pool.end();
})();