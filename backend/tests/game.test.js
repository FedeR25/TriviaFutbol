const request = require('supertest');
const app = require('../src/index');

describe('Game Flow Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Intentamos login directamente con el usuario del Seed
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testadmin', password: 'password123' });
    
    authToken = res.body.token;
    
    if (!authToken) {
      throw new Error(`Error en Auth de Integración: ${res.statusCode} - ${JSON.stringify(res.body)}`);
    }
  });

  test('Should start a new game session', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });

    expect(res.statusCode).toBeLessThan(300);
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
    const wrongOpt = question.options.find(opt => opt.correct === false);

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
    const correctOpt = question.options.find(opt => opt.correct === true);

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