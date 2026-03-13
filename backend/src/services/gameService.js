const gameRepository = require('../repositories/gameRepository');
const rankingService = require('./rankingService');
const logger = require('../utils/logger');

const PENALTY_EASY_MS = 5000;
const PENALTY_HARD_MS = 10000;
const MAX_RESPONSE_TIME_MS = 60000;

const gameService = {
  async startSession(userId, mode, difficulty) {
    const session = await gameRepository.createSession(userId, mode, difficulty);
    logger.info({ message: 'game_started', userId, sessionId: session.id, mode, difficulty });
    return session;
  },

  async submitAnswer(sessionId, userId, questionRefId, questionType, answerGiven, responseTimeMs) {
    const session = await gameRepository.findSessionById(sessionId);

    // Validaciones de seguridad
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

    // Determinar si es correcta
    let isCorrect = false;
    if (questionType === 'teams') {
      isCorrect = answerGiven === questionRefId;
    } else if (questionType === 'players') {
      const { Pool } = require('pg');
      const pool = require('../db/client');
      const result = await pool.query(
        'SELECT team_id FROM players WHERE id = $1',
        [questionRefId]
      );
      const player = result.rows[0];
      isCorrect = player && answerGiven === player.team_id;
    }

    // Guardar respuesta
    await gameRepository.createAnswer(
      sessionId, questionRefId, questionType,
      answerGiven, isCorrect, responseTimeMs
    );

    // Calcular penalización
    const penalty = isCorrect ? 0 :
      (session.difficulty === 'easy' ? PENALTY_EASY_MS : PENALTY_HARD_MS);

    // Actualizar sesión
    const updatedSession = await gameRepository.updateSession(sessionId, {
      correct_answers: session.correct_answers + (isCorrect ? 1 : 0),
      wrong_answers: session.wrong_answers + (isCorrect ? 0 : 1),
      penalty_ms: session.penalty_ms + penalty,
      questions_answered: session.questions_answered + 1,
    });

    logger.info({
      message: 'answer_submitted',
      sessionId,
      questionRefId,
      isCorrect,
      responseTimeMs
    });

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

    const completedSession = await gameRepository.updateSession(sessionId, {
      raw_time_ms: rawTimeMs,
      total_time_ms: totalTimeMs,
      completed: true
    });

    // Actualizar ranking
    const rankingPosition = await rankingService.updateRanking(
      userId, sessionId,
      session.correct_answers,
      totalTimeMs,
      session.mode,
      session.difficulty
    );

    logger.info({
      message: 'game_finished',
      userId,
      sessionId,
      mode: session.mode,
      difficulty: session.difficulty,
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