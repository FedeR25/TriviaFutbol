const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const updates = [
  ['Atletico Tucuman', 'https://r2.thesportsdb.com/images/media/team/badge/sqvwxw1471876021.png'],
  ['Bari', 'https://r2.thesportsdb.com/images/media/team/badge/isfrtg1579724972.png'],
  ['Catanzaro', 'https://r2.thesportsdb.com/images/media/team/badge/byrc5e1691995858.png'],
  ['Chicago Fire', 'https://r2.thesportsdb.com/images/media/team/badge/8xuc781639493166.png'],
  ['Coritiba', 'https://r2.thesportsdb.com/images/media/team/badge/ywwsyu1473538050.png'],
  ['Grenoble', 'https://r2.thesportsdb.com/images/media/team/badge/x2hcpg1488227785.png'],
  ['Kaiserslautern', 'https://r2.thesportsdb.com/images/media/team/badge/jghax31740165513.png'],
  ['LA Galaxy', 'https://r2.thesportsdb.com/images/media/team/badge/ysyysr1420227188.png'],
  ['Leeds United', 'https://r2.thesportsdb.com/images/media/team/badge/jcgrml1756649030.png'],
  ['Levante', 'https://r2.thesportsdb.com/images/media/team/badge/xwtxsx1473503739.png'],
  ['Metz', 'https://r2.thesportsdb.com/images/media/team/badge/1iuew61688452857.png'],
  ['New York City FC', 'https://r2.thesportsdb.com/images/media/team/badge/suytvy1473536462.png'],
  ['Palermo', 'https://r2.thesportsdb.com/images/media/team/badge/zi1tb01579708939.png'],
  ['Quilmes', 'https://r2.thesportsdb.com/images/media/team/badge/1nj5uk1517769025.png'],
  ['Sport Recife', 'https://r2.thesportsdb.com/images/media/team/badge/tyrbls1545421563.png'],
  ['Sunderland', 'https://r2.thesportsdb.com/images/media/team/badge/tprtus1448813498.png'],
  ['Zaragoza', 'https://r2.thesportsdb.com/images/media/team/badge/sxpwxs1473503702.png'],
];

(async () => {
  for (const [name, url] of updates) {
    await pool.query('UPDATE teams SET logo_url = $1 WHERE name = $2', [url, name]);
    console.log('✅', name);
  }
  console.log('Listo!');
  await pool.end();
})();