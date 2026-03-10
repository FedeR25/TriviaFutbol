# TriviaFutbol ⚽

Trivia de fútbol para chicos de 9 años.

## Stack
- Frontend: HTML + CSS + JavaScript vanilla
- Backend: Node.js + Express
- Base de datos: PostgreSQL (Neon.tech)

## Levantar el proyecto

### Requisitos
- Node 20+
- Docker

### Primera vez
1. Clonar el repositorio
2. Entrar al backend: `cd backend`
3. Instalar dependencias: `npm install`
4. Copiar el .env: `cp .env.example .env`
5. Completar las variables en `.env`
6. Levantar la BD: `docker-compose up -d` (desde la raíz)
7. Correr migraciones: `npm run migrate`
8. Correr el seed: `npm run seed`
9. Levantar el servidor: `npm run dev`

### Correr tests
- Unit + Integration: `npm test`
- Cobertura: `npm run test:coverage`
- E2E: `npm run test:e2e`

## Scripts disponibles
| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor en desarrollo |
| `npm run migrate` | Corre migraciones |
| `npm run seed` | Carga equipos y jugadores |
| `npm test` | Corre todos los tests |