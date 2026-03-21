const request = require('supertest');
const app = require('../src/index');

describe('Game Flow Integration Tests', () => {
  let authToken;
  let sessionId;
  // Generamos un usuario único para esta corrida de tests
  const testUser = {
    username: `user_${Date.now()}`,
    password: 'password123'
  };

  beforeAll(async () => {
    // 1. Registro limpio
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // 2. Login para obtener el token real generado por bcrypt
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    
    authToken = res.body.token;
  });

  test('Should start a new game session', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('sessionId');
    sessionId = res.body.sessionId;
  });

  test('Should apply penalty for wrong answer', async () => {
    const startRes = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });
    
    const sId = startRes.body.sessionId;
    const firstQuestion = startRes.body.questions[0];
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
    expect(res.body.isCorrect).toBe(false);
  });

  test('Should score points for a correct answer', async () => {
    const startRes = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });
    
    const sId = startRes.body.sessionId;
    const firstQuestion = startRes.body.questions[0];
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