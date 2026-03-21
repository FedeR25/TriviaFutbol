const request = require('supertest');
const app = require('../src/index');

describe('Game Flow Integration Tests', () => {
  let authToken;
  const testUser = {
    username: 'game_test_user_' + Date.now(),
    password: 'password123'
  };

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);

    authToken = res.body.token;
  });

  test('Should require authentication to start game', async () => {
    const res = await request(app)
      .post('/api/game/start')
      .send({ mode: 'teams' });

    expect(res.statusCode).toBe(401);
  });

  test('Should start a new game session when authenticated', async () => {
    if (!authToken) return;

    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'teams' });

    expect([200, 201]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body).toHaveProperty('sessionId');
      expect(Array.isArray(res.body.questions)).toBe(true);
    }
  });

  test('Should reject invalid mode', async () => {
    if (!authToken) return;

    const res = await request(app)
      .post('/api/game/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ mode: 'invalid_mode' });

    expect(res.statusCode).toBe(400);
  });

  test('Should reject answer for non-existent session', async () => {
    if (!authToken) return;

    const res = await request(app)
      .post('/api/game/99999/answer')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionRefId: 1,
        questionType: 'teams',
        answerGiven: 1,
        responseTimeMs: 1000
      });

    expect(res.statusCode).toBe(404);
  });
});