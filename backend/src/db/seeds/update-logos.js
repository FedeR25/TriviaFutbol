const pool = require('../client');
const logger = require('../../utils/logger');

const TEAMS = [
  'River Plate', 'Boca Juniors', 'Racing Club', 'Independiente', 'San Lorenzo',
  'Huracán', 'Vélez Sársfield', 'Estudiantes', 'Talleres', 'Lanús', 'Belgrano',
  'Gimnasia LP', "Newell's Old Boys", 'Rosario Central', 'Argentinos Juniors',
  'Tigre', 'Godoy Cruz', 'Banfield', 'Colon', 'Defensa y Justicia',
  'Peñarol', 'Nacional', 'Defensor Sporting', 'Danubio', 'Liverpool Uruguay', 'Plaza Colonia',
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos', 'Fluminense',
  'Grêmio', 'Internacional', 'Atletico Mineiro', 'Vasco da Gama', 'Botafogo',
  'Cruzeiro', 'Atletico Paranaense', 'Fortaleza',
  'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia',
  'Villarreal', 'Athletic Club', 'Real Sociedad', 'Betis', 'Osasuna',
  'Celta Vigo', 'Getafe', 'Girona',
  'Manchester City', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester United',
  'Tottenham', 'Newcastle', 'Aston Villa', 'West Ham', 'Brighton',
  'Everton', 'Leicester City', 'Fulham', 'Brentford', 'Crystal Palace',
  'Wolves', 'Nottingham Forest',
  'Inter Milan', 'AC Milan', 'Juventus', 'Napoli', 'Roma', 'Lazio',
  'Fiorentina', 'Atalanta', 'Torino', 'Bologna',
  'Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig',
  'Eintracht Frankfurt', 'Wolfsburg', 'Borussia Monchengladbach', 'Schalke 04',
  'PSG', 'Marseille', 'Lyon', 'Monaco', 'Lille', 'Nice', 'Rennes', 'Lens', 'Strasbourg',
  'Inter Miami', 'Al Nassr', 'Al Hilal', 'Al Ittihad', 'Al Ahli', 'Al Qadsiah', 'Al Ettifaq',
  'Galatasaray', 'Fenerbahce', 'Besiktas',
  'Ajax', 'PSV', 'Feyenoord',
  'Hajduk Split', 'Dinamo Zagreb',
];

const SEARCH_MAP = {
  'Huracán': 'Huracan',
  'Vélez Sársfield': 'Velez Sarsfield',
  'Lanús': 'Lanus',
  'Peñarol': 'Penarol',
  'Grêmio': 'Gremio',
  'São Paulo': 'Sao Paulo',
  'Borussia Monchengladbach': 'Borussia Monchengladbach',
  'Athletic Club': 'Athletic Bilbao',
  'Betis': 'Real Betis',
  'PSG': 'Paris Saint-Germain',
  'Liverpool Uruguay': 'Liverpool Montevideo',
};

async function updateLogos() {
  const client = await pool.connect();
  let updated = 0;
  let notFound = [];

  try {
    for (const dbName of TEAMS) {
      const searchName = SEARCH_MAP[dbName] || dbName;
      const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(searchName)}`;

      let data;
      try {
        const res = await fetch(url);
        data = await res.json();
      } catch (e) {
        notFound.push(dbName);
        await new Promise(r => setTimeout(r, 500));
        continue;
      }

      if (!data.teams || !data.teams[0] || !data.teams[0].strBadge) {
        notFound.push(dbName);
        await new Promise(r => setTimeout(r, 300));
        continue;
      }

      const logoUrl = data.teams[0].strBadge;
      const result = await client.query(
        'UPDATE teams SET logo_url = $1 WHERE name = $2 RETURNING name',
        [logoUrl, dbName]
      );

      if (result.rows.length > 0) {
        updated++;
        console.log('✅ ' + dbName);
      } else {
        notFound.push(dbName);
      }

      await new Promise(r => setTimeout(r, 400));
    }

    logger.info('✅ ' + updated + ' logos actualizados');
    if (notFound.length > 0) {
      logger.warn('⚠️  No encontrados (' + notFound.length + '): ' + notFound.join(', '));
    }

  } finally {
    client.release();
    await pool.end();
  }
}

updateLogos();