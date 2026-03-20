const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const updates = [
  ['Hamburger SV', 'https://r2.thesportsdb.com/images/media/team/badge/tvtppt1473453296.png'],
  ['Brighton', 'https://r2.thesportsdb.com/images/media/team/badge/ywypts1448810904.png'],
  ['PSG', 'https://r2.thesportsdb.com/images/media/team/badge/rwqrrq1473504808.png'],
  ['Talleres', 'https://r2.thesportsdb.com/images/media/team/badge/7hum2t1769310938.png'],
  ['Al Nassr', 'https://r2.thesportsdb.com/images/media/team/badge/84yvqi1748524565.png'],
  ['Sporting Gijon', 'https://r2.thesportsdb.com/images/media/team/badge/xxrtqx1473503054.png'],
  ['Gimnasia LP', 'https://r2.thesportsdb.com/images/media/team/badge/ksqyvk1517768491.png'],
  ['Instituto', 'https://r2.thesportsdb.com/images/media/team/badge/jup59w1578825794.png'],
  ['San Martin Tucuman', 'https://r2.thesportsdb.com/images/media/team/badge/xymq001532856832.png'],
  ['Al Ettifaq', 'https://r2.thesportsdb.com/images/media/team/badge/m272h51694761970.png'],
  ['Al Hilal', 'https://r2.thesportsdb.com/images/media/team/badge/6sdpwg1581543704.png'],
  ['Al Qadsiah', 'https://r2.thesportsdb.com/images/media/team/badge/ok63wb1719134839.png'],
  ['Fénix', 'https://r2.thesportsdb.com/images/media/team/badge/3iz2f51581352430.png'],
  ['Atletico Paranaense', 'https://r2.thesportsdb.com/images/media/team/badge/irzu1u1554237406.png'],
];

(async () => {
  for (const [name, url] of updates) {
    await pool.query('UPDATE teams SET logo_url = $1 WHERE name = $2', [url, name]);
    console.log('✅', name);
  }
  console.log('Listo!');
  await pool.end();
})();