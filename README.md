# TriviaFútbol

Trivia de fútbol pensada para chicos de 9 años. Tiene tres modos de juego, ranking de partidas y cuentas de usuario. Está armada con servicios gratuitos y se desarrolló siguiendo guías paso a paso, sin conocimientos técnicos previos.

Última revisión de este documento: 19/10/2026, contrastado con el contenido del repo.

## Cómo está armado

El código vive en GitHub (`FedeR25/TriviaFutbol`). Render lo despliega en dos servicios, el backend y el frontend, y el backend guarda todo en una base PostgreSQL de Neon. Un job de cron-job.org le pega al backend cada 14 minutos para que Render no lo duerma.

| Pieza | Servicio | Dirección |
|---|---|---|
| Código | GitHub | github.com/FedeR25/TriviaFutbol (rama `main`) |
| Backend (API) | Render, Web Service `TriviaFutbol` | https://triviafutbol.onrender.com |
| Frontend | Render, Static Site `TriviaFutbol-1` (publica la carpeta `frontend/pages`) | https://triviafutbol-1.onrender.com |
| Base de datos | Neon (PostgreSQL) | host `ep-empty-breeze-am6nmp5z` |
| Mantener despierto el backend | cron-job.org, job "TriviaFutbol Ping" | GET a `/api/health` cada 14 minutos |
| Logos de equipos | TheSportsDB | solo se usó para cargar las URLs en la base |

Dos cosas del plan gratuito que explican las demoras. Render duerme el backend tras unos 15 minutos sin uso y el primer request tarda hasta un minuto. Neon también suspende la base cuando está inactiva, así que la primera consulta puede tardar un poco más.

### Despliegue

Render tiene Auto-Deploy en "On Commit" para el frontend: cada push a `main` lo actualiza solo. En el backend falta confirmarlo (Settings, Build & Deploy).

Además hay dos workflows de GitHub Actions que corren en cada push a `main`:

- `main.yml`: levanta un Postgres de prueba, corre los tests y, si pasan, llama al deploy hook de Render (secret `RENDER_DEPLOY_HOOK`).
- `ci.yml`: corre los tests con cobertura usando los secrets del repo (`DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`). También corre en la rama `dev` y en pull requests.

En el run del 19/10/2026 (commit `1ee3a6f`) `main.yml` salió en verde y `ci.yml` falló. Como `main.yml` ya corre los tests, `ci.yml` es un duplicado y se puede borrar. Si Render tiene Auto-Deploy activo en el backend, el deploy hook de `main.yml` también es redundante y provoca un segundo deploy por cada push.

### Mantenimiento del ping

El job de cron-job.org estaba desactivado desde el 31/05/2026 por un error HTTP y se reactivó el 19/10/2026. Si el job falla varias veces seguidas, cron-job.org lo desactiva solo. Conviene tener activadas las notificaciones por mail en la configuración del job.

## Modos de juego

- Equipos: se muestra el escudo y hay que adivinar el equipo.
- Jugadores: se muestra el nombre del jugador y hay que adivinar en qué equipo juega.
- Contra el reloj: 60 segundos, con preguntas mezcladas de equipos y jugadores.

Hay un solo nivel de dificultad, con todos los equipos y jugadores. Las opciones incorrectas salen de la misma liga y división que la respuesta correcta (con la misma `country` como alternativa si no alcanzan), para que no se pueda adivinar por descarte. Cada respuesta incorrecta suma 5 segundos al tiempo total. El puntaje se calcula en el backend.

El ranking se calcula en el momento desde `game_sessions` y muestra las 25 mejores partidas de todos los tiempos. Un mismo usuario puede aparecer varias veces.

## Cuentas de usuario

Usuario y contraseña, sin mail. El usuario admite solo letras y números (3 a 30 caracteres) y la contraseña tiene entre 6 y 100. No hay recupero automático: el admin resetea la contraseña desde el panel y entrega una temporal.

El login devuelve un JWT (vence a los 7 días) y el frontend lo guarda en `localStorage` y lo manda en el header `Authorization: Bearer`. El backend también acepta el token por cookie, pero hoy no lo emite. Al registrarse, el frontend hace el login automático y redirige al inicio sin mostrar ningún mensaje de confirmación.

## Stack

- Frontend: HTML, CSS y JavaScript sin frameworks. Tipografías Fredoka One y Nunito.
- Backend: Node.js 20 con Express 5, Joi para validar, bcrypt (12 rondas), jsonwebtoken, helmet, express-rate-limit, winston para logs.
- Base de datos: PostgreSQL 15, migraciones con node-pg-migrate.
- Tests: Jest y Supertest.

## Base de datos

```
users          id, username, password_hash, is_admin, force_password_reset, created_at
teams          id, name (único), league, country, division, logo_url, external_id, created_at
players        id, name, team_id, league, created_at
game_sessions  id, user_id, mode, correct_answers, wrong_answers, penalty_ms, raw_time_ms,
               total_time_ms, questions_answered, time_limit_ms, completed, created_at
game_answers   id, session_id, question_ref_id, question_type, answer_given, is_correct,
               response_time_ms, created_at
ranking_teams, ranking_players, ranking_timed   (siguen en el schema pero no se usan)
```

En producción hay 142 equipos y 1.985 jugadores de: Argentina (Liga Profesional y Primera Nacional), Uruguay, Brasil, España, Inglaterra, Italia, Alemania y Francia (primera y segunda de cada uno), más MLS, Saudi Pro League, Süper Lig, Eredivisie y HNL para los equipos de jugadores famosos.

## API

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/change-password

POST /api/game/start              devuelve sessionId, mode, questions[]
POST /api/game/:sessionId/answer  devuelve isCorrect, penaltyMs, correctAnswerId
POST /api/game/:sessionId/finish  devuelve el resultado y la posición en el ranking
GET  /api/game/:sessionId/result

GET  /api/ranking/:mode           top 25 partidas

GET  /api/admin/users
PUT  /api/admin/users/:id/reset-password

GET  /api/health
```

Límites de uso: 10 requests cada 15 minutos en auth (el registro y el login comparten ese cupo), 100 por minuto en game y 30 por minuto en ranking.

## Estructura del repo

```
TriviaFutbol/
  .github/workflows/        ci.yml, main.yml
  backend/
    src/
      config/env.js         lee y exige las variables de entorno
      controllers/          auth, game, ranking, admin
      db/
        client.js
        migrations/         9 migraciones
        seeds/              run.js (seed principal) y scripts de logos y jugadores
      middlewares/          auth, errorHandler, rateLimiter, validate
      repositories/         user, game, question, ranking
      routes/               auth, game, ranking, admin
      services/             auth, game, question, ranking
      utils/                logger.js, asyncHandler.js
      index.js              arranque de Express, CORS y rutas
    tests/                  6 archivos de test de Jest
    .env.example
  frontend/
    index.html              redirige a pages/index.html, pero Render no lo publica (se puede borrar)
    pages/                  esta carpeta es la que publica Render
      index.html            página de inicio
      css/                  main.css, game.css
      js/                   api.js (cliente de la API), auth, game, leaderboard, results,
                            select-mode, admin
      login.html, select-mode.html, game.html, results.html,
      leaderboard.html, admin.html
  docker-compose.yml        PostgreSQL local
```

## Correr en local

Requisitos: Node 18 o superior, Docker Desktop y la extensión Live Server de VS Code.

```bash
docker-compose up -d        # desde la raíz del repo: levanta PostgreSQL
cd backend
cp .env.example .env        # y completar las variables
npm install
npm run migrate             # crea las tablas
npm run seed                # carga equipos y jugadores
npm run dev                 # API en http://localhost:3000
```

Variables de `.env`:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://triviafutbol:triviafutbol@localhost:5432/triviafutbol_dev
JWT_SECRET=...
JWT_EXPIRES_IN=7d
COOKIE_SECRET=...
```

Para el frontend, abrir `frontend/pages/login.html` con Live Server (puerto 5500). Ojo: `frontend/pages/js/api.js` tiene la URL de producción escrita a mano. Para probar contra el backend local hay que cambiarla a `http://localhost:3000/api` y volver a dejarla como estaba antes de hacer commit. El archivo `js/config.js` tiene la URL local pero ninguna página lo usa.

El backend solo acepta pedidos desde `localhost:5500`, `127.0.0.1:5500` y `triviafutbol-1.onrender.com`. Si cambia la dirección del frontend (por ejemplo con un dominio propio), hay que editar la lista de `cors` en `backend/src/index.js`.

## Operaciones sobre producción

Se hacen a mano desde la carpeta `backend`, con la connection string de Neon (se saca del panel de Neon y no se sube al repo).

```bash
DATABASE_URL="<neon_url>" npm run migrate
DATABASE_URL="<neon_url>" npm run seed
```

Para crear el usuario admin:

```bash
DATABASE_URL="<neon_url>" node -e "
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  const hash = await bcrypt.hash('CAMBIAR_ESTA_CLAVE', 12);
  await pool.query('INSERT INTO users (username, password_hash, is_admin) VALUES (\$1, \$2, true)', ['admin', hash]);
  await pool.end();
})();
"
```

Las variables de producción (`DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `JWT_EXPIRES_IN`) se cargan en el panel de Render, en el Web Service. El `.env` local nunca se sube (está en `.gitignore`).

## Estado de las pruebas

Hay pruebas de Jest sobre los servicios y controladores de auth y game, y sobre questionService, más un test con Supertest en `game.test.js`. El umbral mínimo de cobertura configurado es 50 %. No hay pruebas de integración completas con base de datos ni E2E: `ci.yml` instala Playwright pero no hay tests que lo usen. Los scripts `test:unit` y `test:int` de `package.json` apuntan a carpetas que no existen, así que solo sirven `npm test` y `npm run test:coverage`.

## Pendientes y cosas raras conocidas

- `PUT /api/auth/change-password` valida los datos pero el controlador no cambia la contraseña: responde "Password changed successfully" sin hacer nada.
- `POST /api/auth/logout` tampoco invalida el token. El cierre de sesión es borrarlo del `localStorage`.
- Registro: mostrar un mensaje de "cuenta creada" y avisar si falla el login automático.
- Sobran archivos: `frontend/index.html` (el redirect), `select-difficulty.html` (la dificultad se eliminó), `frontend/pages/game.js` (se usa `js/game.js`), `errorMiddleware.js` (no se importa en ningún lado) y los scripts `fix-logos` 1 a 4.
- `backend/logs/` está en `.gitignore` pero los dos archivos de log (unos 100 KB) quedaron subidos de antes. Se sacan del repo con `git rm --cached -r backend/logs`.
- Borrar `ci.yml` (falla y duplica a `main.yml`).
- Ampliar jugadores con los planteles completos, fotos de jugadores para el modo Jugadores y dominio propio.
- El 19/10/2026 se restauró `frontend/pages/index.html`, que había quedado borrado en el commit "Mejoras en Diseño".
- Se sacaron del README anterior algunas cosas que ya no eran ciertas: la lista de archivos `ci.yml` y `deploy.yml`, las cookies httpOnly como mecanismo principal y los tests como "pendientes".
