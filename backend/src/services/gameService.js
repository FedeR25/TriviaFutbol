const gameRepository = require('../repositories/gameRepository');
const rankingService = require('./rankingService');
const logger = require('../utils/logger');

const PENALTY_MS = 5000;
const MAX_RESPONSE_TIME_MS = 60000;

const gameService = {
  async startSession(userId, mode) {
    const session = await gameRepository.createSession(userId, mode);
    logger.info({ message: 'game_started', userId, sessionId: session.id, mode });
    return session;
  },

  async submitAnswer(sessionId, userId, questionRefId, questionType, answerGiven, responseTimeMs) {
    const session = await gameRepository.findSessionById(sessionId);

    if (!session) {
      const error = new Error('Sesión no encontrada');
      error.status = 404;
      throw error;
    }
    if (session.user_id !== userId) {
      const error = new Error('No autorizado');
      error.status = 403;
      throw error;
    }
    if (session.completed) {
      const error = new Error('La partida ya terminó');
      error.status = 400;
      throw error;
    }
    if (responseTimeMs <= 0 || responseTimeMs > MAX_RESPONSE_TIME_MS) {
      const error = new Error('Tiempo de respuesta inválido');
      error.status = 400;
      throw error;
    }

    const alreadyAnswered = await gameRepository.wasQuestionAnswered(sessionId, questionRefId);
    if (alreadyAnswered) {
      const error = new Error('Esta pregunta ya fue respondida');
      error.status = 400;
      throw error;
    }

    let isCorrect = false;
    if (questionType === 'teams') {
      isCorrect = answerGiven === questionRefId;
    } else if (questionType === 'players') {
      // Lógica limpia usando el nuevo método del repositorio
      const player = await gameRepository.getPlayerTeam(questionRefId);
      isCorrect = player && answerGiven === player.team_id;
    }

    await gameRepository.createAnswer(
      sessionId, questionRefId, questionType,
      answerGiven, isCorrect, responseTimeMs
    );

    const penalty = isCorrect ? 0 : PENALTY_MS;

    await gameRepository.updateSession(sessionId, {
      correct_answers: session.correct_answers + (isCorrect ? 1 : 0),
      wrong_answers: session.wrong_answers + (isCorrect ? 0 : 1),
      penalty_ms: session.penalty_ms + penalty,
      questions_answered: session.questions_answered + 1,
    });

    logger.info({ message: 'answer_submitted', sessionId, questionRefId, isCorrect, responseTimeMs });

    return { isCorrect, penaltyMs: penalty, correctAnswerId: questionRefId };
  },

  async finishSession(sessionId, userId, rawTimeMs) {
    const session = await gameRepository.findSessionById(sessionId);

    if (!session) {
      const error = new Error('Sesión no encontrada');
      error.status = 404;
      throw error;
    }
    if (session.user_id !== userId) {
      const error = new Error('No autorizado');
      error.status = 403;
      throw error;
    }
    if (session.completed) {
      const error = new Error('La partida ya terminó');
      error.status = 400;
      throw error;
    }

    const totalTimeMs = rawTimeMs + session.penalty_ms;

    await gameRepository.updateSession(sessionId, {
      raw_time_ms: rawTimeMs,
      total_time_ms: totalTimeMs,
      completed: true
    });

    const rankingPosition = await rankingService.updateRanking(
      userId, sessionId,
      session.correct_answers,
      totalTimeMs,
      session.mode
    );

    logger.info({
      message: 'game_finished',
      userId,
      sessionId,
      mode: session.mode,
      correctAnswers: session.correct_answers,
      totalTimeMs,
      rankingPosition
    });

    return {
      correctAnswers: session.correct_answers,
      wrongAnswers: session.wrong_answers,
      penaltyMs: session.penalty_ms,
      rawTimeMs,
      totalTimeMs,
      rankingPosition
    };
  },

  async getResult(sessionId, userId) {
    const session = await gameRepository.findSessionById(sessionId);

    if (!session) {
      const error = new Error('Sesión no encontrada');
      error.status = 404;
      throw error;
    }
    if (session.user_id !== userId) {
      const error = new Error('No autorizado');
      error.status = 403;
      throw error;
    }

    return session;
  }
};

module.exports = gameService;