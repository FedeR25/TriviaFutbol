const gameService = require('../services/gameService');
const questionService = require('../services/questionService');

const gameController = {
  async start(req, res, next) {
    try {
      const { mode } = req.body;
      const session = await gameService.startSession(req.user.id, mode);

      const count = mode === 'timed' ? 50 : 10;
      const questions = await questionService.generateQuestions(mode, count);

      res.status(201).json({
        sessionId: session.id,
        mode: session.mode,
        questions
      });
    } catch (err) {
      next(err);
    }
  },

  async answer(req, res, next) {
    try {
      const { sessionId } = req.params;
      const { questionRefId, questionType, answerGiven, responseTimeMs } = req.body;

      const result = await gameService.submitAnswer(
        parseInt(sessionId),
        req.user.id,
        questionRefId,
        questionType,
        answerGiven,
        responseTimeMs
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async finish(req, res, next) {
    try {
      const { sessionId } = req.params;
      const { rawTimeMs } = req.body;

      const result = await gameService.finishSession(
        parseInt(sessionId),
        req.user.id,
        rawTimeMs
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async result(req, res, next) {
    try {
      const { sessionId } = req.params;
      const session = await gameService.getResult(parseInt(sessionId), req.user.id);
      res.json({ session });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = gameController;