const request = require('supertest');
const app = require('../src/index');

describe('Game Flow Integration Tests', () => {
  let authToken;
  const testUser = { username: `user_${Date.now()}`, password: 'password123' };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/login').send(testUser);
    authToken = res.body.token;
  });

  test('Should start a new game session', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('sessionId');
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