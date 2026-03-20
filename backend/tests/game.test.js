const request = require('supertest');
const { app } = require('../src/index');
// Antes: const { pool } = require('../db/client');
const { pool } = require('../src/db/client');

describe('Game Flow Integration Tests', () => {
  let authToken;
  let sessionId;

  // 1. Setup: Login para obtener token
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'password' }); // Usuario de tu seed
    authToken = res.headers['set-cookie'] || res.body.token;
  });

  // 2. Test de inicio de juego
  test('Should start a new game session', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('sessionId');
    expect(res.body.questions.length).toBeGreaterThan(0);
    sessionId = res.body.sessionId;
  });

  // 3. Test de respuesta con penalización
  test('Should apply penalty for wrong answer', async () => {
    const res = await request(app)
      .post(`/api/game/${sessionId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        questionRefId: 999999, // ID inexistente para forzar error
        answerGiven: 'Incorrect Team' 
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.isCorrect).toBe(false);
    expect(res.body.penaltyMs).toBe(5000); // Según tu README
  });

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos
    
    // Importamos el server que exportamos en index.js para cerrarlo
    const { server } = require('../src/index'); 
    await server.close(); 
  });
});