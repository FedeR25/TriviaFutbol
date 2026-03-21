const request = require('supertest');
const { app, server } = require('../src/index');

describe('Game Flow Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    authToken = res.body.token || (res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0].split('=')[1] : null);
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
    const startRes = await request(app).post('/api/game/start').set('Authorization', `Bearer ${authToken}`).send({ mode: 'teams' });
    const sessionId = startRes.body.sessionId;
    const firstQuestion = startRes.body.questions[0];

    const res = await request(app)
      .post(`/api/game/${sessionId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        questionRefId: firstQuestion.questionRefId,
        questionType: 'teams',
        answerGiven: 999999, // ID incorrecto
        responseTimeMs: 1000
      });

    expect([200, 201]).toContain(res.statusCode);
    const isCorrect = res.body.isCorrect !== undefined ? res.body.isCorrect : res.body.correct;
    expect(isCorrect).toBe(false);
  });

  test('Should score points for a correct answer', async () => {
    const startRes = await request(app).post('/api/game/start').set('Authorization', `Bearer ${authToken}`).send({ mode: 'teams' });
    const sessionId = startRes.body.sessionId;
    const firstQuestion = startRes.body.questions[0];

    // LÓGICA NUEVA: Buscamos el ID del equipo que tiene correct: true
    const correctOption = firstQuestion.options.find(opt => opt.correct === true);
    const correctId = correctOption.id;

    const res = await request(app)
      .post(`/api/game/${sessionId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        questionRefId: firstQuestion.questionRefId,
        questionType: 'teams',
        answerGiven: correctId, // Mandamos el ID del equipo correcto (ej: 118)
        responseTimeMs: 800
      });

    expect([200, 201]).toContain(res.statusCode);
    const isCorrect = res.body.isCorrect !== undefined ? res.body.isCorrect : res.body.correct;
    expect(isCorrect).toBe(true);
  });

 
});