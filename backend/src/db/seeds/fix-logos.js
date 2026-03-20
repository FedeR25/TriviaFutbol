const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const teams = [
  { db: 'Hamburger SV', search: 'Hamburger SV' },
  { db: 'Hannover 96', search: 'Hannover 96' },
  { db: 'Derby County', search: 'Derby County' },
  { db: 'Sheffield United', search: 'Sheffield United' },
  { db: 'PSV', search: 'PSV Eindhoven' },
  { db: 'Dinamo Zagreb', search: 'Dinamo Zagreb' },
  { db: 'Hajduk Split', search: 'Hajduk Split' },
  { db: 'Athletic Club', search: 'Athletic Bilbao' },
  { db: 'Atletico Madrid', search: 'Atletico Madrid' },
  { db: 'Sporting Gijon', search: 'Sporting Gijon' },
  { db: 'Gimnasia LP', search: 'Gimnasia La Plata' },
  { db: 'Talleres', search: 'Talleres Cordoba' },
  { db: 'PSG', search: 'Paris Saint-Germain' },
  { db: 'Caen', search: 'Caen' },
  { db: 'Brighton', search: 'Brighton' },
  { db: 'Leicester City', search: 'Leicester City' },
  { db: 'Ferro Carril Oeste', search: 'Ferro Carril Oeste' },
  { db: 'Instituto', search: 'Instituto Cordoba' },
  { db: 'San Martin Tucuman', search: 'San Martin Tucuman' },
  { db: 'Al Ettifaq', search: 'Al Ettifaq' },
  { db: 'Al Hilal', search: 'Al Hilal' },
  { db: 'Al Nassr', search: 'Al Nassr' },
  { db: 'Al Qadsiah', search: 'Al Qadsiah' },
  { db: 'Fénix', search: 'Fenix Montevideo' },
  { db: 'Rampla Juniors', search: 'Rampla Juniors' },
  { db: 'Atletico Mineiro', search: 'Atletico Mineiro' },
  { db: 'Atletico Paranaense', search: 'Atletico Paranaense' },
  { db: 'Guarani', search: 'Guarani' },
  { db: 'Besiktas', search: 'Besiktas' },
  { db: 'Fenerbahce', search: 'Fenerbahce' },
];

(async () => {
  let updated = 0;
  for (const team of teams) {
    try {
      const res = await fetch('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=' + encodeURIComponent(team.search));
      const data = await res.json();
      if (!data.teams || !data.teams[0] || !data.teams[0].strBadge) {
        console.log('No encontrado:', team.db);
        await new Promise(r => setTimeout(r, 300));
        continue;
      }
      await pool.query('UPDATE teams SET logo_url = $1 WHERE name = $2', [data.teams[0].strBadge, team.db]);
      console.log('✅', team.db);
      updated++;
      await new Promise(r => setTimeout(r, 500));
    } catch(e) {
      console.log('❌', team.db, e.message);
    }
  }
  console.log('Total actualizado:', updated);
  await pool.end();
})();
