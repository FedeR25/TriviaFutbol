const request = require('supertest');
const app = require('../src/index');

describe('Game Flow Integration Tests', () => {
  let authToken;
  // Usuario dinámico para evitar errores de base de datos
  const uniqueUser = {
    username: `user_${Date.now()}`,
    password: 'password123'
  };

  beforeAll(async () => {
    // 1. Registro (usando tu API para que bcrypt genere el hash correctamente)
    await request(app).post('/api/auth/register').send(uniqueUser);
    
    // 2. Login
    const res = await request(app).post('/api/auth/login').send(uniqueUser);
    
    authToken = res.body.token;
    if (!authToken) {
      throw new Error("No se pudo obtener el token en la integración");
    }
  });

  test('Should start a new game session', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });

    expect(res.statusCode).toBeLessThan(400);
    expect(res.body).toHaveProperty('sessionId');
    expect(res.body.questions.length).toBeGreaterThan(0);
  });

  test('Should apply penalty for wrong answer', async () => {
    const startRes = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });
    
    const sId = startRes.body.sessionId;
    const question = startRes.body.questions[0];
    const wrongOpt = question.options.find(opt => !opt.correct);

    const res = await request(app)
      .post(`/api/game/${sId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionRefId: question.id,
        optionId: wrongOpt.id,
        responseTimeMs: 1000
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.isCorrect).toBe(false);
  });

  test('Should score points for a correct answer', async () => {
    const startRes = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });
    
    const sId = startRes.body.sessionId;
    const question = startRes.body.questions[0];
    const correctOpt = question.options.find(opt => opt.correct);

    const res = await request(app)
      .post(`/api/game/${sId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionRefId: question.id,
        optionId: correctOpt.id,
        responseTimeMs: 500
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.isCorrect).toBe(true);
  });
});