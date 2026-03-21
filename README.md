# TriviaFútbol ⚽

App de trivia de fútbol para chicos, desarrollada paso a paso con stack 100% gratuito y permanente.

---

## 🎯 Concepto y Análisis Previo

### Idea original
App de trivia de fútbol orientada a chicos de 9 años. El objetivo era crear algo divertido, visual y con ranking competitivo.

### Decisiones de diseño tomadas antes de escribir código

**Modos de juego** — Se definieron 3 modos:
- 🛡️ **Modo Equipos**: se muestra el escudo, el jugador adivina qué equipo es
- ⭐ **Modo Jugadores**: se muestra el nombre del jugador, el jugador adivina en qué equipo juega
- ⏱️ **Contra el Reloj**: 60 segundos, mix de equipos y jugadores

**Dificultad** — Originalmente se planificaron 2 niveles:
- Fácil ("Juveniles"): equipos de primera división, jugadores famosos (`is_famous=true`)
- Difícil ("Primera División"): todas las divisiones, todos los jugadores

> ⚠️ **Modificación posterior**: Se eliminó el sistema de dificultad completamente. Se decidió tener un solo nivel con todos los jugadores y equipos disponibles. Esto simplificó el código, el schema de BD y el frontend.

**Opciones en preguntas** — Se decidió que las opciones incorrectas deben ser de la **misma liga y división** que la respuesta correcta, para evitar que se adivine por descarte fácilmente.

**Ranking** — Originalmente 6 tablas separadas (3 modos × 2 dificultades). Luego de eliminar la dificultad se pasó a 3 tablas. Finalmente se cambió a un ranking dinámico calculado directamente desde `game_sessions`, mostrando las **25 mejores partidas de todos los tiempos** (una misma persona puede aparecer múltiples veces).

**Auth** — Usuario + contraseña (sin email). Sin recupero automático de contraseña — el admin resetea manualmente y entrega una contraseña temporal. JWT en httpOnly cookie + header Authorization Bearer.

**Penalización** — 5 segundos por respuesta incorrecta, sumados al tiempo total.

---

## 🏗️ Stack Técnico

| Capa | Tecnología | Servicio |
|------|-----------|---------|
| Frontend | HTML + CSS + JS vanilla | Render (Static Site) |
| Backend | Node.js + Express | Render (Web Service) |
| Base de datos | PostgreSQL | Neon.tech |
| Imágenes equipos | TheSportsDB API | CDN propio |
| CI/CD | GitHub Actions | GitHub |
| Repositorio | Git | GitHub (FedeR25/TriviaFutbol) |

**Todo gratuito y sin expiración.**

---

## 🗄️ Schema de Base de Datos

```sql
users
  id, username, password_hash, is_admin, force_password_reset, created_at

teams
  id, name, league, country, division, logo_url, external_id, created_at
  UNIQUE(name)

players
  id, name, team_id → teams, league, created_at
  (se eliminaron: country, is_famous)

game_sessions
  id, user_id → users, mode, correct_answers, wrong_answers,
  penalty_ms, raw_time_ms, total_time_ms, questions_answered,
  time_limit_ms, completed, created_at
  (se eliminó: difficulty)

game_answers
  id, session_id → game_sessions, question_ref_id, question_type,
  answer_given, is_correct, response_time_ms, created_at

ranking_teams    → reemplazó ranking_teams_easy + ranking_teams_hard
ranking_players  → reemplazó ranking_players_easy + ranking_players_hard
ranking_timed    → reemplazó ranking_timed_easy + ranking_timed_hard
```

> Las tablas de ranking se mantienen en el schema pero el ranking activo se calcula directamente desde `game_sessions`.

---

## 📡 Endpoints API

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/change-password

POST /api/game/start              → { sessionId, mode, questions[] }
POST /api/game/:sessionId/answer  → { isCorrect, penaltyMs, correctAnswerId }
POST /api/game/:sessionId/finish  → { correctAnswers, wrongAnswers, penaltyMs, rawTimeMs, totalTimeMs, rankingPosition }
GET  /api/game/:sessionId/result

GET  /api/ranking/:mode           → top 25 partidas de todos los tiempos

GET  /api/admin/users
PUT  /api/admin/users/:id/reset-password

GET  /api/health
```

---

## 🗂️ Estructura de Carpetas

```
TriviaFutbol/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── backend/
│   └── src/
│       ├── config/env.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── gameController.js
│       │   ├── rankingController.js
│       │   └── adminController.js
│       ├── db/
│       │   ├── client.js
│       │   ├── migrations/
│       │   └── seeds/
│       │       ├── run.js               ← seed principal
│       │       ├── update-logos.js      ← actualiza logos via API
│       │       ├── fix-logos.js         ← fix logos batch 1
│       │       ├── fix-logos2.js        ← fix logos batch 2
│       │       ├── fix-logos3.js        ← fix logos batch 3
│       │       ├── fix-logos4.js        ← fix logos batch 4
│       │       ├── check-logos.js       ← verifica logos rotos
│       │       └── import-players.js    ← import masivo (experimental)
│       ├── middlewares/
│       │   ├── auth.js
│       │   ├── errorHandler.js
│       │   ├── rateLimiter.js
│       │   └── validate.js
│       ├── repositories/
│       │   ├── userRepository.js
│       │   ├── gameRepository.js
│       │   ├── questionRepository.js
│       │   └── rankingRepository.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── game.js
│       │   ├── ranking.js
│       │   └── admin.js
│       ├── services/
│       │   ├── authService.js
│       │   ├── gameService.js
│       │   ├── questionService.js
│       │   └── rankingService.js
│       ├── utils/logger.js
│       └── index.js
├── frontend/
│   └── pages/
│       ├── css/
│       │   ├── main.css
│       │   └── game.css
│       ├── js/
│       │   ├── api.js
│       │   ├── game.js
│       │   └── leaderboard.js
│       ├── index.html
│       ├── login.html
│       ├── select-mode.html
│       ├── game.html
│       ├── results.html
│       ├── leaderboard.html
│       └── admin.html
├── docker-compose.yml
└── README.md
```

---

## 🚀 Fases del Proyecto

### ✅ Fase 1 — Estructura del repositorio
- Git init, estructura de carpetas
- Dependencias instaladas
- GitHub Actions configurado (CI + deploy)
- README inicial

### ✅ Fase 2 — Base de datos
- Docker + PostgreSQL local (puerto 5432)
- 8 migraciones ejecutadas
- Seed inicial: equipos y jugadores famosos
- Migración adicional: `add_unique_name_to_teams`

### ✅ Fase 3 — Backend / API
- Express + Helmet + CORS + Cookie Parser
- JWT auth (httpOnly cookie + Bearer token)
- Rate limiting por endpoint
- Validaciones con Joi
- Logs estructurados con Winston
- Todos los endpoints funcionando y testeados con curl

### ✅ Fase 4 — Frontend
- HTML + CSS + JS vanilla
- Estilo Kahoot: botones grandes, colores vivos
- Tipografía: Fredoka One (títulos) + Nunito (cuerpo)
- Mobile first, responsive
- Lenguaje argentino: "¡Gooool!", "Revancha", etc.
- Pantallas: Home, Login/Registro, Selección de modo, Juego, Resultados, Leaderboard, Admin

### ✅ Fase 6 — Deploy
- BD producción en Neon.tech
- Backend en Render: https://triviafutbol.onrender.com
- Frontend en Render: https://triviafutbol-1.onrender.com
- Cron job en cron-job.org cada 14 minutos para mantener el servidor activo (plan gratuito duerme)
- Usuario admin creado directamente en Neon

### ⏳ Fase 5 — Tests (pendiente)
- Unit tests con Jest: authService, gameService, questionService
- Integration tests con Supertest: auth, game, ranking
- E2E tests con Playwright
- Cobertura mínima objetivo: 80%

---

## 🔧 Modificaciones Importantes Durante el Desarrollo

### 1. Eliminación del sistema de dificultad
**Antes**: 2 niveles (Juveniles / Primera División), filtrado por `is_famous` y `division`
**Después**: Un solo nivel, todos los jugadores y equipos disponibles
**Archivos modificados**: `questionService.js`, `questionRepository.js`, `gameService.js`, `rankingRepository.js`, `rankingService.js`, `routes/game.js`, `routes/ranking.js`, `frontend/pages/select-mode.html`, `frontend/pages/game.js`
**Migraciones**: `remove_difficulty_from_game_sessions`, `remove_country_isfamous_from_players`, `rename_ranking_tables`

### 2. Cambio en el sistema de ranking
**Antes**: Tablas dedicadas guardando solo la mejor partida por usuario
**Después**: Ranking calculado dinámicamente desde `game_sessions`, mostrando las 25 mejores partidas de todos los tiempos (un usuario puede aparecer varias veces)

### 3. Auth con token en localStorage (desarrollo)
Para resolver el problema de cookies entre puertos diferentes (backend :3000, Live Server :5500), se implementó envío del JWT via header `Authorization: Bearer` además de cookie httpOnly.

### 4. Opciones de preguntas de la misma liga
Las opciones incorrectas se filtran por `league` y `division` igual al equipo correcto, con fallback por `country`.

### 5. Logos de equipos
Las URLs del seed original eran inventadas. Se actualizaron usando la API pública de TheSportsDB con múltiples scripts de fix (`fix-logos.js` hasta `fix-logos4.js`). Todos los 142 equipos tienen logos reales de `r2.thesportsdb.com`.

---

## 📊 Datos en Producción

| Tabla | Registros |
|-------|----------|
| teams | 142 |
| players | 1.985 |

**Ligas incluidas:**
- Argentina: Liga Profesional + Primera Nacional
- Uruguay: Primera División + Segunda División
- Brasil: Série A + Série B
- España: La Liga + La Liga 2
- Inglaterra: Premier League + Championship
- Italia: Serie A + Serie B
- Alemania: Bundesliga + 2. Bundesliga
- Francia: Ligue 1 + Ligue 2
- MLS, Saudi Pro League, Süper Lig, Eredivisie, HNL (para equipos de jugadores famosos)

---

## 🛠️ Setup Local

### Requisitos
- Node.js v18+
- Docker Desktop
- VS Code con extensión Live Server

### Backend
```bash
cd backend
cp .env.example .env   # completar variables
docker-compose up -d   # levantar PostgreSQL
npm install
npm run migrate        # crear tablas
npm run seed           # cargar datos
npm run dev            # servidor en :3000
```

### Frontend
Abrir `frontend/pages/index.html` con Live Server (puerto 5500).

### Variables de entorno (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://triviafutbol:triviafutbol@localhost:5432/triviafutbol_dev
JWT_SECRET=...
JWT_EXPIRES_IN=7d
COOKIE_SECRET=...
```

---

## 🌐 Deploy

### Producción
| Servicio | URL |
|---------|-----|
| Backend | https://triviafutbol.onrender.com |
| Frontend | https://triviafutbol-1.onrender.com |
| BD | Neon.tech (ep-empty-breeze-am6nmp5z) |

### Correr migraciones en producción
```bash
DATABASE_URL="<neon_url>" npm run migrate
```

### Correr seed en producción
```bash
DATABASE_URL="<neon_url>" npm run seed
```

### Crear admin en producción
```bash
node -e "
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const pool = new Pool({ connectionString: '<neon_url>' });
(async () => {
  const hash = await bcrypt.hash('password', 12);
  await pool.query('INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, true)', ['admin', hash]);
  await pool.end();
})();
"
```

---

## 🔐 Seguridad
- helmet (headers HTTP)
- express-rate-limit (10 req/15min en auth, 100 req/min en game)
- Joi (validación de inputs)
- bcrypt (hash de contraseñas, 12 rounds)
- JWT con expiración de 7 días
- httpOnly cookies + Bearer token
- Score calculado 100% en backend (anti-cheat)
- CORS configurado para orígenes específicos

---

## ⏳ Pendiente

- [ ] Tests (Jest + Supertest + Playwright) — Fase 5
- [ ] Arreglar GitHub Actions (error en deploy hooks)
- [ ] Agregar más jugadores (CSV con planteles completos de las 16 ligas)
- [ ] Fotos de jugadores para el modo Jugadores
- [ ] Dominio personalizado