const pool = require('../client');
const logger = require('../../utils/logger');

const teams = [
  // Argentina - Primera
  { name: 'River Plate', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/xvuwtw1448813215.png', external_id: 442 },
  { name: 'Boca Juniors', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/uvwxyz1420227079.png', external_id: 443 },
  { name: 'Racing Club', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/racing-club1520628875.png', external_id: 444 },
  { name: 'Independiente', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/independiente1520628875.png', external_id: 445 },
  { name: 'San Lorenzo', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/san-lorenzo1520628875.png', external_id: 446 },
  { name: 'Huracán', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/huracan1520628875.png', external_id: 447 },
  { name: 'Vélez Sársfield', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/velez1520628875.png', external_id: 448 },
  { name: 'Estudiantes', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/estudiantes1520628875.png', external_id: 449 },
  { name: 'Talleres', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/talleres1520628875.png', external_id: 450 },
  { name: 'Lanús', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lanus1520628875.png', external_id: 451 },
  { name: 'Belgrano', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/belgrano1520628875.png', external_id: 452 },
  { name: 'Gimnasia LP', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/gimnasia1520628875.png', external_id: 453 },
  { name: 'Newell\'s Old Boys', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/newells1520628875.png', external_id: 454 },
  { name: 'Rosario Central', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/rosario1520628875.png', external_id: 455 },
  { name: 'Argentinos Juniors', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/argentinos1520628875.png', external_id: 456 },
  // Uruguay - Primera
  { name: 'Peñarol', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/penarol1520628875.png', external_id: 457 },
  { name: 'Nacional', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/nacional1520628875.png', external_id: 458 },
  { name: 'Defensor Sporting', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/defensor1520628875.png', external_id: 459 },
  { name: 'Danubio', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/danubio1520628875.png', external_id: 460 },
  { name: 'Liverpool Uruguay', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/liverpool-uy1520628875.png', external_id: 461 },
  // Brasil - Primera
  { name: 'Flamengo', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/flamengo1520628875.png', external_id: 462 },
  { name: 'Palmeiras', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/palmeiras1520628875.png', external_id: 463 },
  { name: 'Corinthians', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/corinthians1520628875.png', external_id: 464 },
  { name: 'São Paulo', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/saopaulo1520628875.png', external_id: 465 },
  { name: 'Santos', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/santos1520628875.png', external_id: 466 },
  { name: 'Fluminense', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/fluminense1520628875.png', external_id: 467 },
  { name: 'Grêmio', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/gremio1520628875.png', external_id: 468 },
  { name: 'Internacional', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/internacional1520628875.png', external_id: 469 },
  { name: 'Atletico Mineiro', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atleticomineiro1520628875.png', external_id: 470 },
  { name: 'Vasco da Gama', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/vasco1520628875.png', external_id: 471 },
  // España - Primera
  { name: 'Real Madrid', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/real-madrid1520628875.png', external_id: 472 },
  { name: 'Barcelona', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/barcelona1520628875.png', external_id: 473 },
  { name: 'Atletico Madrid', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atleticomadrid1520628875.png', external_id: 474 },
  { name: 'Sevilla', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/sevilla1520628875.png', external_id: 475 },
  { name: 'Valencia', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/valencia1520628875.png', external_id: 476 },
  { name: 'Villarreal', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/villarreal1520628875.png', external_id: 477 },
  { name: 'Athletic Club', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/athletic1520628875.png', external_id: 478 },
  { name: 'Real Sociedad', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/realsociedad1520628875.png', external_id: 479 },
  { name: 'Betis', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/betis1520628875.png', external_id: 480 },
  // Inglaterra - Primera
  { name: 'Manchester City', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/manchester-city1520628875.png', external_id: 481 },
  { name: 'Liverpool', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/liverpool1520628875.png', external_id: 482 },
  { name: 'Arsenal', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/arsenal1520628875.png', external_id: 483 },
  { name: 'Chelsea', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/chelsea1520628875.png', external_id: 484 },
  { name: 'Manchester United', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/manchester-united1520628875.png', external_id: 485 },
  { name: 'Tottenham', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/tottenham1520628875.png', external_id: 486 },
  { name: 'Newcastle', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/newcastle1520628875.png', external_id: 487 },
  { name: 'Aston Villa', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/aston-villa1520628875.png', external_id: 488 },
  { name: 'West Ham', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/westham1520628875.png', external_id: 489 },
  { name: 'Brighton', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/brighton1520628875.png', external_id: 490 },
  // Italia - Primera
  { name: 'Inter Milan', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/inter1520628875.png', external_id: 491 },
  { name: 'AC Milan', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/milan1520628875.png', external_id: 492 },
  { name: 'Juventus', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/juventus1520628875.png', external_id: 493 },
  { name: 'Napoli', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/napoli1520628875.png', external_id: 494 },
  { name: 'Roma', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/roma1520628875.png', external_id: 495 },
  { name: 'Lazio', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lazio1520628875.png', external_id: 496 },
  { name: 'Fiorentina', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/fiorentina1520628875.png', external_id: 497 },
  { name: 'Atalanta', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atalanta1520628875.png', external_id: 498 },
  // Alemania - Primera
  { name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/bayern1520628875.png', external_id: 499 },
  { name: 'Borussia Dortmund', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/dortmund1520628875.png', external_id: 500 },
  { name: 'Bayer Leverkusen', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/leverkusen1520628875.png', external_id: 501 },
  { name: 'RB Leipzig', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/leipzig1520628875.png', external_id: 502 },
  { name: 'Eintracht Frankfurt', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/frankfurt1520628875.png', external_id: 503 },
  { name: 'Wolfsburg', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/wolfsburg1520628875.png', external_id: 504 },
  // Francia - Primera
  { name: 'PSG', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/psg1520628875.png', external_id: 505 },
  { name: 'Marseille', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/marseille1520628875.png', external_id: 506 },
  { name: 'Lyon', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lyon1520628875.png', external_id: 507 },
  { name: 'Monaco', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/monaco1520628875.png', external_id: 508 },
  { name: 'Lille', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lille1520628875.png', external_id: 509 },
  { name: 'Nice', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/nice1520628875.png', external_id: 510 },
];

const players = [
  { name: 'Lionel Messi', team_name: 'Inter Miami', league: 'MLS', country: 'Argentina', is_famous: true },
  { name: 'Cristiano Ronaldo', team_name: 'Al Nassr', league: 'Saudi Pro League', country: 'Portugal', is_famous: true },
  { name: 'Kylian Mbappé', team_name: 'Real Madrid', league: 'La Liga', country: 'Francia', is_famous: true },
  { name: 'Erling Haaland', team_name: 'Manchester City', league: 'Premier League', country: 'Noruega', is_famous: true },
  { name: 'Vinicius Jr', team_name: 'Real Madrid', league: 'La Liga', country: 'Brasil', is_famous: true },
  { name: 'Neymar Jr', team_name: 'Al Hilal', league: 'Saudi Pro League', country: 'Brasil', is_famous: true },
  { name: 'Lamine Yamal', team_name: 'Barcelona', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Pedri', team_name: 'Barcelona', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Jude Bellingham', team_name: 'Real Madrid', league: 'La Liga', country: 'Inglaterra', is_famous: true },
  { name: 'Marcus Rashford', team_name: 'Manchester United', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Harry Kane', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Inglaterra', is_famous: true },
  { name: 'Rodri', team_name: 'Manchester City', league: 'Premier League', country: 'España', is_famous: true },
  { name: 'Toni Kroos', team_name: 'Real Madrid', league: 'La Liga', country: 'Alemania', is_famous: true },
  { name: 'Lautaro Martinez', team_name: 'Inter Milan', league: 'Serie A', country: 'Argentina', is_famous: true },
  { name: 'Julian Alvarez', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Argentina', is_famous: true },
  { name: 'Paulo Dybala', team_name: 'Roma', league: 'Serie A', country: 'Argentina', is_famous: true },
  { name: 'Enzo Fernandez', team_name: 'Chelsea', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Alexis Mac Allister', team_name: 'Liverpool', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Rodrigo De Paul', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Argentina', is_famous: true },
  { name: 'Antoine Griezmann', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Francia', is_famous: true },
  { name: 'Olivier Giroud', team_name: 'AC Milan', league: 'Serie A', country: 'Francia', is_famous: true },
  { name: 'Bukayo Saka', team_name: 'Arsenal', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Leandro Trossard', team_name: 'Arsenal', league: 'Premier League', country: 'Bélgica', is_famous: true },
  { name: 'Victor Osimhen', team_name: 'Napoli', league: 'Serie A', country: 'Nigeria', is_famous: true },
  { name: 'Rafael Leao', team_name: 'AC Milan', league: 'Serie A', country: 'Portugal', is_famous: true },
  { name: 'Federico Valverde', team_name: 'Real Madrid', league: 'La Liga', country: 'Uruguay', is_famous: true },
  { name: 'Darwin Nunez', team_name: 'Liverpool', league: 'Premier League', country: 'Uruguay', is_famous: true },
  { name: 'Luis Suarez', team_name: 'Inter Miami', league: 'MLS', country: 'Uruguay', is_famous: true },
  { name: 'Edinson Cavani', team_name: 'Boca Juniors', league: 'Liga Profesional', country: 'Uruguay', is_famous: true },
  { name: 'Robert Lewandowski', team_name: 'Barcelona', league: 'La Liga', country: 'Polonia', is_famous: true },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logger.info('🌱 Iniciando seed...');

    // Insertar equipos
    for (const team of teams) {
      await client.query(
        `INSERT INTO teams (name, league, country, division, logo_url, external_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [team.name, team.league, team.country, team.division, team.logo_url, team.external_id]
      );
    }
    logger.info(`✅ ${teams.length} equipos insertados`);

    // Insertar jugadores
    for (const player of players) {
      const teamResult = await client.query(
        'SELECT id FROM teams WHERE name = $1',
        [player.team_name]
      );
      const teamId = teamResult.rows[0]?.id || null;

      await client.query(
        `INSERT INTO players (name, team_id, league, country, is_famous)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [player.name, teamId, player.league, player.country, player.is_famous]
      );
    }
    logger.info(`✅ ${players.length} jugadores insertados`);

await client.query('COMMIT');
    logger.info('🎉 Seed completado exitosamente');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en el seed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();