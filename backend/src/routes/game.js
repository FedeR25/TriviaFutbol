const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate } = require('../middlewares/auth');
const { gameLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');
const Joi = require('joi');

const startSchema = Joi.object({
  mode: Joi.string().valid('teams', 'players', 'timed').required()
    .messages({ 'any.only': 'Modo inválido. Debe ser teams, players o timed' }),
  difficulty: Joi.string().valid('easy', 'hard').required()
    .messages({ 'any.only': 'Dificultad inválida. Debe ser easy o hard' })
});

const answerSchema = Joi.object({
  questionRefId: Joi.number().integer().positive().required(),
  questionType: Joi.string().valid('teams', 'players').required(),
  answerGiven: Joi.number().integer().positive().required(),
  responseTimeMs: Joi.number().integer().min(1).max(60000).required()
});

const finishSchema = Joi.object({
  rawTimeMs: Joi.number().integer().min(1).required()
});

router.post('/start', authenticate, gameLimiter, validate(startSchema), gameController.start);
router.post('/:sessionId/answer', authenticate, gameLimiter, validate(answerSchema), gameController.answer);
router.post('/:sessionId/finish', authenticate, gameLimiter, validate(finishSchema), gameController.finish);
router.get('/:sessionId/result', authenticate, gameLimiter, gameController.result);

module.exports = router;