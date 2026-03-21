const request = require('supertest');
const app = require('../src/index');

describe('Game Flow Integration Tests', () => {
  let authToken;
  let sessionId;

  beforeAll(async () => {
    // 1. Intentamos registrar al usuario por si la base está vacía
    // Ignoramos si falla (por si ya existe de un test previo)
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'admin', password: 'admin123' });

    // 2. Login para obtener el token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    authToken = res.body.token;
  });

  test('Should start a new game session', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('sessionId');
    expect(res.body.questions.length).toBeGreaterThan(0);
    sessionId = res.body.sessionId;
  });

  test('Should apply penalty for wrong answer', async () => {
    const startRes = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });
    
    const sId = startRes.body.sessionId;
    const firstQuestion = startRes.body.questions[0];

    // Buscamos una opción que NO sea la correcta
    const wrongOption = firstQuestion.options.find(opt => !opt.correct);

    const res = await request(app)
      .post(`/api/game/${sId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionRefId: firstQuestion.id,
        optionId: wrongOption.id,
        responseTimeMs: 1000
      });

    expect(res.statusCode).toBe(200);
    // Verificamos que el score bajó o se aplicó la lógica de error
    expect(res.body.isCorrect).toBe(false);
  });

  test('Should score points for a correct answer', async () => {
    const startRes = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });
    
    const sId = startRes.body.sessionId;
    const firstQuestion = startRes.body.questions[0];

    // Buscamos la opción que tiene correct: true
    const correctOption = firstQuestion.options.find(opt => opt.correct === true);

    const res = await request(app)
      .post(`/api/game/${sId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionRefId: firstQuestion.id,
        optionId: correctOption.id,
        responseTimeMs: 500
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.isCorrect).toBe(true);
  });
});