const pool = require('../client');
const logger = require('../../utils/logger');

const teams = [
  // Argentina - Primera
  { name: 'River Plate', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/xvuwtw1448813215.png', external_id: 442 },
  { name: 'Boca Juniors', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/uvwxyz1420227079.png', external_id: 443 },
  { name: 'Racing Club', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/racing1520628875.png', external_id: 444 },
  { name: 'Independiente', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/independiente1520628875.png', external_id: 445 },
  { name: 'San Lorenzo', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/sanlorenzo1520628875.png', external_id: 446 },
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
  { name: 'Tigre', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/tigre1520628875.png', external_id: 457 },
  { name: 'Godoy Cruz', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/godoyCruz1520628875.png', external_id: 458 },
  { name: 'Banfield', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/banfield1520628875.png', external_id: 459 },
  { name: 'Colon', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/colon1520628875.png', external_id: 460 },
  { name: 'Defensa y Justicia', league: 'Liga Profesional', country: 'Argentina', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/defensa1520628875.png', external_id: 461 },
  // Argentina - Segunda
  { name: 'Quilmes', league: 'Primera Nacional', country: 'Argentina', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/quilmes1520628875.png', external_id: 462 },
  { name: 'San Martin Tucuman', league: 'Primera Nacional', country: 'Argentina', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/sanmartin1520628875.png', external_id: 463 },
  { name: 'Atletico Tucuman', league: 'Primera Nacional', country: 'Argentina', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atleticotucuman1520628875.png', external_id: 464 },
  { name: 'Instituto', league: 'Primera Nacional', country: 'Argentina', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/instituto1520628875.png', external_id: 465 },
  { name: 'Ferro Carril Oeste', league: 'Primera Nacional', country: 'Argentina', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/ferro1520628875.png', external_id: 466 },
  // Uruguay - Primera
  { name: 'Peñarol', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/penarol1520628875.png', external_id: 467 },
  { name: 'Nacional', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/nacional1520628875.png', external_id: 468 },
  { name: 'Defensor Sporting', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/defensor1520628875.png', external_id: 469 },
  { name: 'Danubio', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/danubio1520628875.png', external_id: 470 },
  { name: 'Liverpool Uruguay', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/liverpooluy1520628875.png', external_id: 471 },
  { name: 'Plaza Colonia', league: 'Primera División', country: 'Uruguay', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/plaza1520628875.png', external_id: 472 },
  // Uruguay - Segunda
  { name: 'Rampla Juniors', league: 'Segunda División', country: 'Uruguay', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/rampla1520628875.png', external_id: 473 },
  { name: 'Fénix', league: 'Segunda División', country: 'Uruguay', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/fenix1520628875.png', external_id: 474 },
  // Brasil - Primera
  { name: 'Flamengo', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/flamengo1520628875.png', external_id: 475 },
  { name: 'Palmeiras', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/palmeiras1520628875.png', external_id: 476 },
  { name: 'Corinthians', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/corinthians1520628875.png', external_id: 477 },
  { name: 'São Paulo', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/saopaulo1520628875.png', external_id: 478 },
  { name: 'Santos', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/santos1520628875.png', external_id: 479 },
  { name: 'Fluminense', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/fluminense1520628875.png', external_id: 480 },
  { name: 'Grêmio', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/gremio1520628875.png', external_id: 481 },
  { name: 'Internacional', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/internacional1520628875.png', external_id: 482 },
  { name: 'Atletico Mineiro', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atleticomineiro1520628875.png', external_id: 483 },
  { name: 'Vasco da Gama', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/vasco1520628875.png', external_id: 484 },
  { name: 'Botafogo', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/botafogo1520628875.png', external_id: 485 },
  { name: 'Cruzeiro', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/cruzeiro1520628875.png', external_id: 486 },
  { name: 'Atletico Paranaense', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atleticopr1520628875.png', external_id: 487 },
  { name: 'Fortaleza', league: 'Série A', country: 'Brasil', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/fortaleza1520628875.png', external_id: 488 },
  // Brasil - Segunda
  { name: 'Sport Recife', league: 'Série B', country: 'Brasil', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/sport1520628875.png', external_id: 489 },
  { name: 'Coritiba', league: 'Série B', country: 'Brasil', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/coritiba1520628875.png', external_id: 490 },
  { name: 'Guarani', league: 'Série B', country: 'Brasil', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/guarani1520628875.png', external_id: 491 },
  // España - Primera
  { name: 'Real Madrid', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/realmadrid1520628875.png', external_id: 492 },
  { name: 'Barcelona', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/barcelona1520628875.png', external_id: 493 },
  { name: 'Atletico Madrid', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atleticomadrid1520628875.png', external_id: 494 },
  { name: 'Sevilla', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/sevilla1520628875.png', external_id: 495 },
  { name: 'Valencia', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/valencia1520628875.png', external_id: 496 },
  { name: 'Villarreal', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/villarreal1520628875.png', external_id: 497 },
  { name: 'Athletic Club', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/athletic1520628875.png', external_id: 498 },
  { name: 'Real Sociedad', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/realsociedad1520628875.png', external_id: 499 },
  { name: 'Betis', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/betis1520628875.png', external_id: 500 },
  { name: 'Osasuna', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/osasuna1520628875.png', external_id: 501 },
  { name: 'Celta Vigo', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/celta1520628875.png', external_id: 502 },
  { name: 'Getafe', league: 'La Liga', country: 'España', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/getafe1520628875.png', external_id: 503 },
  // España - Segunda
  { name: 'Sporting Gijon', league: 'La Liga 2', country: 'España', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/gijon1520628875.png', external_id: 504 },
  { name: 'Levante', league: 'La Liga 2', country: 'España', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/levante1520628875.png', external_id: 505 },
  { name: 'Valladolid', league: 'La Liga 2', country: 'España', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/valladolid1520628875.png', external_id: 506 },
  { name: 'Zaragoza', league: 'La Liga 2', country: 'España', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/zaragoza1520628875.png', external_id: 507 },
  // Inglaterra - Primera
  { name: 'Manchester City', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/manchestercity1520628875.png', external_id: 508 },
  { name: 'Liverpool', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/liverpool1520628875.png', external_id: 509 },
  { name: 'Arsenal', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/arsenal1520628875.png', external_id: 510 },
  { name: 'Chelsea', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/chelsea1520628875.png', external_id: 511 },
  { name: 'Manchester United', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/manchesterunited1520628875.png', external_id: 512 },
  { name: 'Tottenham', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/tottenham1520628875.png', external_id: 513 },
  { name: 'Newcastle', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/newcastle1520628875.png', external_id: 514 },
  { name: 'Aston Villa', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/astonvilla1520628875.png', external_id: 515 },
  { name: 'West Ham', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/westham1520628875.png', external_id: 516 },
  { name: 'Brighton', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/brighton1520628875.png', external_id: 517 },
  { name: 'Everton', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/everton1520628875.png', external_id: 518 },
  { name: 'Leicester City', league: 'Premier League', country: 'Inglaterra', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/leicester1520628875.png', external_id: 519 },
  // Inglaterra - Segunda
  { name: 'Leeds United', league: 'Championship', country: 'Inglaterra', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/leeds1520628875.png', external_id: 520 },
  { name: 'Sunderland', league: 'Championship', country: 'Inglaterra', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/sunderland1520628875.png', external_id: 521 },
  { name: 'Derby County', league: 'Championship', country: 'Inglaterra', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/derby1520628875.png', external_id: 522 },
  { name: 'Sheffield United', league: 'Championship', country: 'Inglaterra', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/sheffieldunited1520628875.png', external_id: 523 },
  // Italia - Primera
  { name: 'Inter Milan', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/inter1520628875.png', external_id: 524 },
  { name: 'AC Milan', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/milan1520628875.png', external_id: 525 },
  { name: 'Juventus', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/juventus1520628875.png', external_id: 526 },
  { name: 'Napoli', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/napoli1520628875.png', external_id: 527 },
  { name: 'Roma', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/roma1520628875.png', external_id: 528 },
  { name: 'Lazio', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lazio1520628875.png', external_id: 529 },
  { name: 'Fiorentina', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/fiorentina1520628875.png', external_id: 530 },
  { name: 'Atalanta', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/atalanta1520628875.png', external_id: 531 },
  { name: 'Torino', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/torino1520628875.png', external_id: 532 },
  { name: 'Bologna', league: 'Serie A', country: 'Italia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/bologna1520628875.png', external_id: 533 },
  // Italia - Segunda
  { name: 'Palermo', league: 'Serie B', country: 'Italia', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/palermo1520628875.png', external_id: 534 },
  { name: 'Bari', league: 'Serie B', country: 'Italia', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/bari1520628875.png', external_id: 535 },
  { name: 'Catanzaro', league: 'Serie B', country: 'Italia', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/catanzaro1520628875.png', external_id: 536 },
  // Alemania - Primera
  { name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/bayernmunich1520628875.png', external_id: 537 },
  { name: 'Borussia Dortmund', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/dortmund1520628875.png', external_id: 538 },
  { name: 'Bayer Leverkusen', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/leverkusen1520628875.png', external_id: 539 },
  { name: 'RB Leipzig', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/leipzig1520628875.png', external_id: 540 },
  { name: 'Eintracht Frankfurt', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/frankfurt1520628875.png', external_id: 541 },
  { name: 'Wolfsburg', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/wolfsburg1520628875.png', external_id: 542 },
  { name: 'Borussia Monchengladbach', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/monchengladbach1520628875.png', external_id: 543 },
  { name: 'Schalke 04', league: 'Bundesliga', country: 'Alemania', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/schalke1520628875.png', external_id: 544 },
  // Alemania - Segunda
  { name: 'Hamburger SV', league: '2. Bundesliga', country: 'Alemania', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/hamburger1520628875.png', external_id: 545 },
  { name: 'Hannover 96', league: '2. Bundesliga', country: 'Alemania', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/hannover1520628875.png', external_id: 546 },
  { name: 'Kaiserslautern', league: '2. Bundesliga', country: 'Alemania', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/kaiserslautern1520628875.png', external_id: 547 },
  // Francia - Primera
  { name: 'PSG', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/psg1520628875.png', external_id: 548 },
  { name: 'Marseille', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/marseille1520628875.png', external_id: 549 },
  { name: 'Lyon', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lyon1520628875.png', external_id: 550 },
  { name: 'Monaco', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/monaco1520628875.png', external_id: 551 },
  { name: 'Lille', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lille1520628875.png', external_id: 552 },
  { name: 'Nice', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/nice1520628875.png', external_id: 553 },
  { name: 'Rennes', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/rennes1520628875.png', external_id: 554 },
  { name: 'Lens', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/lens1520628875.png', external_id: 555 },
  { name: 'Strasbourg', league: 'Ligue 1', country: 'Francia', division: 'primera', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/strasbourg1520628875.png', external_id: 556 },
  // Francia - Segunda
  { name: 'Metz', league: 'Ligue 2', country: 'Francia', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/metz1520628875.png', external_id: 557 },
  { name: 'Caen', league: 'Ligue 2', country: 'Francia', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/caen1520628875.png', external_id: 558 },
  { name: 'Grenoble', league: 'Ligue 2', country: 'Francia', division: 'segunda', logo_url: 'https://www.thesportsdb.com/images/media/team/badge/grenoble1520628875.png', external_id: 559 },
];

const players = [
  // Argentina
  { name: 'Lionel Messi', team_name: 'Inter Miami', league: 'MLS', country: 'Argentina', is_famous: true },
  { name: 'Lautaro Martinez', team_name: 'Inter Milan', league: 'Serie A', country: 'Argentina', is_famous: true },
  { name: 'Julian Alvarez', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Argentina', is_famous: true },
  { name: 'Paulo Dybala', team_name: 'Roma', league: 'Serie A', country: 'Argentina', is_famous: true },
  { name: 'Enzo Fernandez', team_name: 'Chelsea', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Alexis Mac Allister', team_name: 'Liverpool', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Rodrigo De Paul', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Argentina', is_famous: true },
  { name: 'Angel Di Maria', team_name: 'Benfica', league: 'Primeira Liga', country: 'Argentina', is_famous: true },
  { name: 'Sergio Aguero', team_name: 'Independiente', league: 'Liga Profesional', country: 'Argentina', is_famous: true },
  { name: 'Nicolas Otamendi', team_name: 'Benfica', league: 'Primeira Liga', country: 'Argentina', is_famous: true },
  { name: 'Leandro Paredes', team_name: 'Roma', league: 'Serie A', country: 'Argentina', is_famous: true },
  { name: 'Giovanni Lo Celso', team_name: 'Tottenham', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Alejandro Garnacho', team_name: 'Manchester United', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Thiago Almada', team_name: 'Botafogo', league: 'Série A', country: 'Argentina', is_famous: true },
  // Uruguay
  { name: 'Federico Valverde', team_name: 'Real Madrid', league: 'La Liga', country: 'Uruguay', is_famous: true },
  { name: 'Darwin Nunez', team_name: 'Liverpool', league: 'Premier League', country: 'Uruguay', is_famous: true },
  { name: 'Luis Suarez', team_name: 'Inter Miami', league: 'MLS', country: 'Uruguay', is_famous: true },
  { name: 'Edinson Cavani', team_name: 'Boca Juniors', league: 'Liga Profesional', country: 'Uruguay', is_famous: true },
  { name: 'Ronald Araujo', team_name: 'Barcelona', league: 'La Liga', country: 'Uruguay', is_famous: true },
  { name: 'Rodrigo Bentancur', team_name: 'Tottenham', league: 'Premier League', country: 'Uruguay', is_famous: true },
  { name: 'Fede Valverde', team_name: 'Real Madrid', league: 'La Liga', country: 'Uruguay', is_famous: true },
  // Brasil
  { name: 'Vinicius Jr', team_name: 'Real Madrid', league: 'La Liga', country: 'Brasil', is_famous: true },
  { name: 'Neymar Jr', team_name: 'Al Hilal', league: 'Saudi Pro League', country: 'Brasil', is_famous: true },
  { name: 'Rodrygo', team_name: 'Real Madrid', league: 'La Liga', country: 'Brasil', is_famous: true },
  { name: 'Raphinha', team_name: 'Barcelona', league: 'La Liga', country: 'Brasil', is_famous: true },
  { name: 'Endrick', team_name: 'Real Madrid', league: 'La Liga', country: 'Brasil', is_famous: true },
  { name: 'Bruno Guimaraes', team_name: 'Newcastle', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Casemiro', team_name: 'Manchester United', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Alisson', team_name: 'Liverpool', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Ederson', team_name: 'Manchester City', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Marquinhos', team_name: 'PSG', league: 'Ligue 1', country: 'Brasil', is_famous: true },
  { name: 'Gabriel Martinelli', team_name: 'Arsenal', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Gabriel Magalhaes', team_name: 'Arsenal', league: 'Premier League', country: 'Brasil', is_famous: true },
  // España
  { name: 'Lamine Yamal', team_name: 'Barcelona', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Pedri', team_name: 'Barcelona', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Gavi', team_name: 'Barcelona', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Rodri', team_name: 'Manchester City', league: 'Premier League', country: 'España', is_famous: true },
  { name: 'Dani Carvajal', team_name: 'Real Madrid', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Ferran Torres', team_name: 'Barcelona', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Mikel Merino', team_name: 'Arsenal', league: 'Premier League', country: 'España', is_famous: true },
  { name: 'Fabian Ruiz', team_name: 'PSG', league: 'Ligue 1', country: 'España', is_famous: true },
  // Francia
  { name: 'Kylian Mbappé', team_name: 'Real Madrid', league: 'La Liga', country: 'Francia', is_famous: true },
  { name: 'Antoine Griezmann', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Francia', is_famous: true },
  { name: 'Ousmane Dembele', team_name: 'PSG', league: 'Ligue 1', country: 'Francia', is_famous: true },
  { name: 'Theo Hernandez', team_name: 'AC Milan', league: 'Serie A', country: 'Francia', is_famous: true },
  { name: 'Aurelien Tchouameni', team_name: 'Real Madrid', league: 'La Liga', country: 'Francia', is_famous: true },
  { name: 'Eduardo Camavinga', team_name: 'Real Madrid', league: 'La Liga', country: 'Francia', is_famous: true },
  { name: 'Marcus Thuram', team_name: 'Inter Milan', league: 'Serie A', country: 'Francia', is_famous: true },
  { name: 'William Saliba', team_name: 'Arsenal', league: 'Premier League', country: 'Francia', is_famous: true },
  // Inglaterra
  { name: 'Jude Bellingham', team_name: 'Real Madrid', league: 'La Liga', country: 'Inglaterra', is_famous: true },
  { name: 'Harry Kane', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Inglaterra', is_famous: true },
  { name: 'Bukayo Saka', team_name: 'Arsenal', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Phil Foden', team_name: 'Manchester City', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Marcus Rashford', team_name: 'Manchester United', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Declan Rice', team_name: 'Arsenal', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Trent Alexander-Arnold', team_name: 'Liverpool', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  // Alemania
  { name: 'Florian Wirtz', team_name: 'Bayer Leverkusen', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Jamal Musiala', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Leroy Sane', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Kai Havertz', team_name: 'Arsenal', league: 'Premier League', country: 'Alemania', is_famous: true },
  { name: 'Toni Kroos', team_name: 'Real Madrid', league: 'La Liga', country: 'Alemania', is_famous: true },
  // Italia
  { name: 'Federico Chiesa', team_name: 'Liverpool', league: 'Premier League', country: 'Italia', is_famous: true },
  { name: 'Gianluigi Donnarumma', team_name: 'PSG', league: 'Ligue 1', country: 'Italia', is_famous: true },
  { name: 'Nicolo Barella', team_name: 'Inter Milan', league: 'Serie A', country: 'Italia', is_famous: true },
  { name: 'Sandro Tonali', team_name: 'Newcastle', league: 'Premier League', country: 'Italia', is_famous: true },
  // Portugal
  { name: 'Cristiano Ronaldo', team_name: 'Al Nassr', league: 'Saudi Pro League', country: 'Portugal', is_famous: true },
  { name: 'Bruno Fernandes', team_name: 'Manchester United', league: 'Premier League', country: 'Portugal', is_famous: true },
  { name: 'Rafael Leao', team_name: 'AC Milan', league: 'Serie A', country: 'Portugal', is_famous: true },
  { name: 'Ruben Dias', team_name: 'Manchester City', league: 'Premier League', country: 'Portugal', is_famous: true },
  { name: 'Bernardo Silva', team_name: 'Manchester City', league: 'Premier League', country: 'Portugal', is_famous: true },
  { name: 'Joao Felix', team_name: 'Chelsea', league: 'Premier League', country: 'Portugal', is_famous: true },
  // Noruega
  { name: 'Erling Haaland', team_name: 'Manchester City', league: 'Premier League', country: 'Noruega', is_famous: true },
  // Bélgica
  { name: 'Kevin De Bruyne', team_name: 'Manchester City', league: 'Premier League', country: 'Bélgica', is_famous: true },
  { name: 'Romelu Lukaku', team_name: 'Napoli', league: 'Serie A', country: 'Bélgica', is_famous: true },
  // Polonia
  { name: 'Robert Lewandowski', team_name: 'Barcelona', league: 'La Liga', country: 'Polonia', is_famous: true },
  // Nigeria
  { name: 'Victor Osimhen', team_name: 'Napoli', league: 'Serie A', country: 'Nigeria', is_famous: true },
  // Egipto
  { name: 'Mohamed Salah', team_name: 'Liverpool', league: 'Premier League', country: 'Egipto', is_famous: true },
  // Senegal
  { name: 'Sadio Mane', team_name: 'Al Nassr', league: 'Saudi Pro League', country: 'Senegal', is_famous: true },
  // Croacia
  { name: 'Luka Modric', team_name: 'Real Madrid', league: 'La Liga', country: 'Croacia', is_famous: true },
  { name: 'Ivan Perisic', team_name: 'Hajduk Split', league: 'HNL', country: 'Croacia', is_famous: true },
  // Eslovenia
  { name: 'Jan Oblak', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Eslovenia', is_famous: true },
  // Países Bajos
  { name: 'Virgil van Dijk', team_name: 'Liverpool', league: 'Premier League', country: 'Países Bajos', is_famous: true },
  { name: 'Frenkie de Jong', team_name: 'Barcelona', league: 'La Liga', country: 'Países Bajos', is_famous: true },
  { name: 'Cody Gakpo', team_name: 'Liverpool', league: 'Premier League', country: 'Países Bajos', is_famous: true },
// Más Argentina
  { name: 'Franco Armani', team_name: 'River Plate', league: 'Liga Profesional', country: 'Argentina', is_famous: true },
  { name: 'Marcos Rojo', team_name: 'Boca Juniors', league: 'Liga Profesional', country: 'Argentina', is_famous: true },
  { name: 'Nicolas Gonzalez', team_name: 'Juventus', league: 'Serie A', country: 'Argentina', is_famous: true },
  { name: 'Exequiel Palacios', team_name: 'Bayer Leverkusen', league: 'Bundesliga', country: 'Argentina', is_famous: true },
  { name: 'Nahuel Molina', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Argentina', is_famous: true },
  { name: 'Cristian Romero', team_name: 'Tottenham', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Lisandro Martinez', team_name: 'Manchester United', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Gerardo Morales', team_name: 'Racing Club', league: 'Liga Profesional', country: 'Argentina', is_famous: false },
  { name: 'German Pezzella', team_name: 'Betis', league: 'La Liga', country: 'Argentina', is_famous: true },
  { name: 'Guido Rodriguez', team_name: 'Betis', league: 'La Liga', country: 'Argentina', is_famous: true },
  { name: 'Valentin Carboni', team_name: 'Marseille', league: 'Ligue 1', country: 'Argentina', is_famous: true },
  { name: 'Facundo Buonanotte', team_name: 'Brighton', league: 'Premier League', country: 'Argentina', is_famous: true },
  { name: 'Mauro Icardi', team_name: 'Galatasaray', league: 'Süper Lig', country: 'Argentina', is_famous: true },
  { name: 'Sergio Romero', team_name: 'Boca Juniors', league: 'Liga Profesional', country: 'Argentina', is_famous: true },
  // Más Uruguay
  { name: 'Jose Maria Gimenez', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Uruguay', is_famous: true },
  { name: 'Martin Caceres', team_name: 'Nacional', league: 'Primera División', country: 'Uruguay', is_famous: true },
  { name: 'Edinson Cavani', team_name: 'Boca Juniors', league: 'Liga Profesional', country: 'Uruguay', is_famous: true },
  { name: 'Matias Vecino', team_name: 'Lazio', league: 'Serie A', country: 'Uruguay', is_famous: true },
  { name: 'Nahitan Nandez', team_name: 'Cagliari', league: 'Serie A', country: 'Uruguay', is_famous: true },
  { name: 'Maxi Gomez', team_name: 'Fenerbahce', league: 'Süper Lig', country: 'Uruguay', is_famous: true },
  // Más Brasil
  { name: 'Thiago Silva', team_name: 'Fluminense', league: 'Série A', country: 'Brasil', is_famous: true },
  { name: 'Richarlison', team_name: 'Tottenham', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Fred', team_name: 'Manchester United', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Fabinho', team_name: 'Al Ittihad', league: 'Saudi Pro League', country: 'Brasil', is_famous: true },
  { name: 'Roberto Firmino', team_name: 'Al Ahli', league: 'Saudi Pro League', country: 'Brasil', is_famous: true },
  { name: 'Antony', team_name: 'Manchester United', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Militao', team_name: 'Real Madrid', league: 'La Liga', country: 'Brasil', is_famous: true },
  { name: 'Lucas Paqueta', team_name: 'West Ham', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Andreas Pereira', team_name: 'Fulham', league: 'Premier League', country: 'Brasil', is_famous: true },
  { name: 'Danilo', team_name: 'Juventus', league: 'Serie A', country: 'Brasil', is_famous: true },
  // Más España
  { name: 'Sergio Ramos', team_name: 'Sevilla', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Marco Asensio', team_name: 'Aston Villa', league: 'Premier League', country: 'España', is_famous: true },
  { name: 'Alvaro Morata', team_name: 'AC Milan', league: 'Serie A', country: 'España', is_famous: true },
  { name: 'Dani Olmo', team_name: 'Barcelona', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Mikel Oyarzabal', team_name: 'Real Sociedad', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Joselu', team_name: 'Real Madrid', league: 'La Liga', country: 'España', is_famous: true },
  { name: 'Eric Garcia', team_name: 'Girona', league: 'La Liga', country: 'España', is_famous: true },
  // Más Francia
  { name: 'Raphael Varane', team_name: 'Manchester United', league: 'Premier League', country: 'Francia', is_famous: true },
  { name: 'Kingsley Coman', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Francia', is_famous: true },
  { name: 'Adrien Rabiot', team_name: 'Juventus', league: 'Serie A', country: 'Francia', is_famous: true },
  { name: 'Benjamin Pavard', team_name: 'Inter Milan', league: 'Serie A', country: 'Francia', is_famous: true },
  { name: 'Matteo Guendouzi', team_name: 'Lazio', league: 'Serie A', country: 'Francia', is_famous: true },
  { name: 'Christopher Nkunku', team_name: 'Chelsea', league: 'Premier League', country: 'Francia', is_famous: true },
  { name: 'Jonathan Clauss', team_name: 'Marseille', league: 'Ligue 1', country: 'Francia', is_famous: true },
  // Más Inglaterra
  { name: 'Jordan Henderson', team_name: 'Ajax', league: 'Eredivisie', country: 'Inglaterra', is_famous: true },
  { name: 'Raheem Sterling', team_name: 'Arsenal', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Jack Grealish', team_name: 'Manchester City', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Mason Mount', team_name: 'Manchester United', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Conor Gallagher', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Inglaterra', is_famous: true },
  { name: 'Ivan Toney', team_name: 'Al Ahli', league: 'Saudi Pro League', country: 'Inglaterra', is_famous: true },
  { name: 'Reece James', team_name: 'Chelsea', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  { name: 'Luke Shaw', team_name: 'Manchester United', league: 'Premier League', country: 'Inglaterra', is_famous: true },
  // Más Alemania
  { name: 'Thomas Muller', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Manuel Neuer', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Leon Goretzka', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Marco Reus', team_name: 'Borussia Dortmund', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Ilkay Gundogan', team_name: 'Barcelona', league: 'La Liga', country: 'Alemania', is_famous: true },
  { name: 'Joshua Kimmich', team_name: 'Bayern Munich', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  { name: 'Antonio Rudiger', team_name: 'Real Madrid', league: 'La Liga', country: 'Alemania', is_famous: true },
  { name: 'Nico Schlotterbeck', team_name: 'Borussia Dortmund', league: 'Bundesliga', country: 'Alemania', is_famous: true },
  // Más Italia
  { name: 'Lorenzo Pellegrini', team_name: 'Roma', league: 'Serie A', country: 'Italia', is_famous: true },
  { name: 'Ciro Immobile', team_name: 'Besiktas', league: 'Süper Lig', country: 'Italia', is_famous: true },
  { name: 'Leonardo Bonucci', team_name: 'Fenerbahce', league: 'Süper Lig', country: 'Italia', is_famous: true },
  { name: 'Marco Verratti', team_name: 'Al Arabi', league: 'Qatar Stars League', country: 'Italia', is_famous: true },
  { name: 'Alessandro Bastoni', team_name: 'Inter Milan', league: 'Serie A', country: 'Italia', is_famous: true },
  { name: 'Giacomo Raspadori', team_name: 'Napoli', league: 'Serie A', country: 'Italia', is_famous: true },
  // Más Portugal
  { name: 'Joao Cancelo', team_name: 'Barcelona', league: 'La Liga', country: 'Portugal', is_famous: true },
  { name: 'Diogo Jota', team_name: 'Liverpool', league: 'Premier League', country: 'Portugal', is_famous: true },
  { name: 'Andre Silva', team_name: 'RB Leipzig', league: 'Bundesliga', country: 'Portugal', is_famous: true },
  { name: 'Vitinha', team_name: 'PSG', league: 'Ligue 1', country: 'Portugal', is_famous: true },
  { name: 'Nuno Mendes', team_name: 'PSG', league: 'Ligue 1', country: 'Portugal', is_famous: true },
  // Otros países famosos
  { name: 'Son Heung-min', team_name: 'Tottenham', league: 'Premier League', country: 'Corea del Sur', is_famous: true },
  { name: 'Karim Benzema', team_name: 'Al Ittihad', league: 'Saudi Pro League', country: 'Francia', is_famous: true },
  { name: 'Riyad Mahrez', team_name: 'Al Ahli', league: 'Saudi Pro League', country: 'Argelia', is_famous: true },
  { name: 'Ivan Perisic', team_name: 'Hajduk Split', league: 'HNL', country: 'Croacia', is_famous: true },
  { name: 'Marcelo Brozovic', team_name: 'Al Nassr', league: 'Saudi Pro League', country: 'Croacia', is_famous: true },
  { name: 'Achraf Hakimi', team_name: 'PSG', league: 'Ligue 1', country: 'Marruecos', is_famous: true },
  { name: 'Hakim Ziyech', team_name: 'Galatasaray', league: 'Süper Lig', country: 'Marruecos', is_famous: true },
  { name: 'Yassine Bounou', team_name: 'Al Hilal', league: 'Saudi Pro League', country: 'Marruecos', is_famous: true },
  { name: 'Memphis Depay', team_name: 'Atletico Madrid', league: 'La Liga', country: 'Países Bajos', is_famous: true },
  { name: 'Georginio Wijnaldum', team_name: 'Al Ettifaq', league: 'Saudi Pro League', country: 'Países Bajos', is_famous: true },
  { name: 'Franck Kessie', team_name: 'Al Ahli', league: 'Saudi Pro League', country: 'Costa de Marfil', is_famous: true },
  { name: 'Wilfried Zaha', team_name: 'Galatasaray', league: 'Süper Lig', country: 'Costa de Marfil', is_famous: true },
  { name: 'Yannick Carrasco', team_name: 'Al Qadsiah', league: 'Saudi Pro League', country: 'Bélgica', is_famous: true },
  { name: 'Romelu Lukaku', team_name: 'Napoli', league: 'Serie A', country: 'Bélgica', is_famous: true },
  { name: 'Loïs Openda', team_name: 'RB Leipzig', league: 'Bundesliga', country: 'Bélgica', is_famous: true },
  { name: 'Granit Xhaka', team_name: 'Bayer Leverkusen', league: 'Bundesliga', country: 'Suiza', is_famous: true },
  { name: 'Xherdan Shaqiri', team_name: 'Chicago Fire', league: 'MLS', country: 'Suiza', is_famous: true },
  { name: 'Dusan Vlahovic', team_name: 'Juventus', league: 'Serie A', country: 'Serbia', is_famous: true },
  { name: 'Sergej Milinkovic-Savic', team_name: 'Al Hilal', league: 'Saudi Pro League', country: 'Serbia', is_famous: true },
  { name: 'Andre Onana', team_name: 'Manchester United', league: 'Premier League', country: 'Camerún', is_famous: true },
  { name: 'Hirving Lozano', team_name: 'PSV', league: 'Eredivisie', country: 'México', is_famous: true },
  { name: 'Raul Jimenez', team_name: 'Fulham', league: 'Premier League', country: 'México', is_famous: true },
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
         ON CONFLICT (name) DO UPDATE SET
           league = EXCLUDED.league,
           country = EXCLUDED.country,
           division = EXCLUDED.division,
           logo_url = EXCLUDED.logo_url,
           external_id = EXCLUDED.external_id`,
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