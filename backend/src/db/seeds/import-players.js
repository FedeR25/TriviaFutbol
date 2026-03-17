const pool = require('../client');
const logger = require('../../utils/logger');

// IDs reales de TheSportsDB para cada equipo
const TEAM_IDS = {
  // Argentina
  'River Plate': 135171,
  'Boca Juniors': 135175,
  'Racing Club': 135178,
  'Independiente': 135177,
  'San Lorenzo': 135174,
  'Huracán': 135179,
  'Vélez Sársfield': 135180,
  'Estudiantes': 135183,
  'Talleres': 135184,
  'Lanús': 135182,
  'Belgrano': 135185,
  'Gimnasia LP': 135186,
  "Newell's Old Boys": 135181,
  'Rosario Central': 135176,
  'Argentinos Juniors': 135187,
  'Tigre': 135188,
  'Godoy Cruz': 135189,
  'Banfield': 135190,
  'Colon': 135191,
  'Defensa y Justicia': 135192,
  // Uruguay
  'Peñarol': 135761,
  'Nacional': 135762,
  'Defensor Sporting': 135763,
  'Danubio': 135764,
  // Brasil
  'Flamengo': 135155,
  'Palmeiras': 135156,
  'Corinthians': 135157,
  'São Paulo': 135158,
  'Santos': 135159,
  'Fluminense': 135160,
  'Grêmio': 135161,
  'Internacional': 135162,
  'Atletico Mineiro': 135163,
  'Vasco da Gama': 135164,
  'Botafogo': 135165,
  'Cruzeiro': 135166,
  'Atletico Paranaense': 135167,
  'Fortaleza': 135168,
  // España
  'Real Madrid': 133604,
  'Barcelona': 133739,
  'Atletico Madrid': 133718,
  'Sevilla': 133633,
  'Valencia': 133632,
  'Villarreal': 133637,
  'Athletic Club': 133612,
  'Real Sociedad': 133700,
  'Betis': 133629,
  'Osasuna': 133613,
  'Celta Vigo': 133631,
  'Getafe': 133659,
  'Girona': 135269,
  // Inglaterra
  'Manchester City': 134741,
  'Liverpool': 134825,
  'Arsenal': 133604,
  'Chelsea': 135143,
  'Manchester United': 133881,
  'Tottenham': 135095,
  'Newcastle': 135368,
  'Aston Villa': 133461,
  'West Ham': 135059,
  'Brighton': 135298,
  'Everton': 134142,
  'Leicester City': 134793,
  'Fulham': 135240,
  'Brentford': 134764,
  'Crystal Palace': 134054,
  'Wolves': 135315,
  'Nottingham Forest': 134681,
  // Italia
  'Inter Milan': 133728,
  'AC Milan': 133728,
  'Juventus': 133775,
  'Napoli': 133738,
  'Roma': 133691,
  'Lazio': 133692,
  'Fiorentina': 133693,
  'Atalanta': 133694,
  'Torino': 133695,
  'Bologna': 133696,
  // Alemania
  'Bayern Munich': 133602,
  'Borussia Dortmund': 133670,
  'Bayer Leverkusen': 133606,
  'RB Leipzig': 135262,
  'Eintracht Frankfurt': 133671,
  'Wolfsburg': 133697,
  'Borussia Monchengladbach': 133667,
  'Schalke 04': 133668,
  // Francia
  'PSG': 133579,
  'Marseille': 133580,
  'Lyon': 133581,
  'Monaco': 133591,
  'Lille': 133592,
  'Nice': 133593,
  'Rennes': 133594,
  'Lens': 133595,
  'Strasbourg': 133596,
  // MLS
  'Inter Miami': 138851,
  // Turquía
  'Galatasaray': 134374,
  'Fenerbahce': 134375,
  'Besiktas': 134376,
  // Países Bajos
  'Ajax': 134666,
  'PSV': 134667,
  'Feyenoord': 134668,
};

async function importPlayers() {
  const client = await pool.connect();
  let totalInserted = 0;

  try {
    // Obtener todos los equipos de la BD
    const teamsResult = await client.query('SELECT id, name FROM teams ORDER BY name');
    const teams = teamsResult.rows;

    logger.info(`🔍 Importando jugadores para ${teams.length} equipos...`);

    for (const team of teams) {
      const externalId = TEAM_IDS[team.name];

      if (!externalId) {
        console.log(`⚠️  Sin ID: ${team.name}`);
        continue;
      }

      const url = `https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${externalId}`;

      let playersData;
      try {
        const res = await fetch(url);
        playersData = await res.json();
      } catch (e) {
        console.log(`⚠️  Error obteniendo jugadores de ${team.name}`);
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      if (!playersData.player) {
        console.log(`⚠️  Sin jugadores: ${team.name}`);
        await new Promise(r => setTimeout(r, 500));
        continue;
      }

      const players = playersData.player.filter(p => p.strSport === 'Soccer');
      let inserted = 0;

      for (const player of players) {
        const name = player.strPlayer;
        const photo = player.strThumb || player.strCutout || null;
        const nationality = player.strNationality || null;

        try {
          const result = await client.query(
            `INSERT INTO players (name, team_id, league, country, photo_url, is_famous)
             VALUES ($1, $2, $3, $4, $5, false)
             ON CONFLICT DO NOTHING
             RETURNING id`,
            [name, team.id, null, nationality, photo]
          );
          if (result.rows.length > 0) inserted++;
        } catch (e) {
          // ignorar errores
        }
      }

      totalInserted += inserted;
      console.log(`✅ ${team.name}: ${inserted} nuevos (${players.length} en API)`);

      await new Promise(r => setTimeout(r, 700));
    }

    logger.info(`🎉 Total: ${totalInserted} jugadores insertados`);

    // Contar total en BD
    const countResult = await client.query('SELECT COUNT(*) FROM players');
    logger.info(`📊 Total jugadores en BD: ${countResult.rows[0].count}`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

importPlayers();