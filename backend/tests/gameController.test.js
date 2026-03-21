const gameController = require('../src/controllers/gameController');
const gameService = require('../src/services/gameService');
const questionService = require('../src/services/questionService');

jest.mock('../src/services/gameService');
jest.mock('../src/services/questionService');

describe('gameController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { 
      body: {}, 
      params: {}, 
      user: { id: 1 } 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('start', () => {
    test('Debe iniciar sesión y devolver preguntas (201)', async () => {
      req.body = { mode: 'teams' };
      gameService.startSession.mockResolvedValue({ id: 100, mode: 'teams' });
      questionService.generateQuestions.mockResolvedValue([{ id: 1, text: '¿?' }]);

      await gameController.start(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ sessionId: 100 }));
    });

    test('Debe fallar si el servicio de preguntas explota (Cobertura de Catch)', async () => {
      req.body = { mode: 'teams' };
      const error = new Error('DB Error');
      gameService.startSession.mockRejectedValue(error);

      await gameController.start(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('answer', () => {
    test('Debe procesar una respuesta correctamente', async () => {
      req.params = { sessionId: '100' };
      req.body = { questionRefId: 1, questionType: 'teams', answerGiven: 1, responseTimeMs: 500 };
      gameService.submitAnswer.mockResolvedValue({ isCorrect: true });

      await gameController.answer(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ isCorrect: true });
    });

    test('Debe capturar errores en submitAnswer', async () => {
      req.params = { sessionId: '100' };
      const error = new Error('Sesión terminada');
      gameService.submitAnswer.mockRejectedValue(error);

      await gameController.answer(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});