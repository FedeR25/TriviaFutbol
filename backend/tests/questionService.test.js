const questionService = require('../src/services/questionService');
const questionRepository = require('../src/repositories/questionRepository');

jest.mock('../src/repositories/questionRepository');

describe('questionService - Cobertura Agresiva', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Modo timed: Debe combinar y mezclar equipos y jugadores', async () => {
    // Simulamos que devuelve 1 equipo y 1 jugador
    questionRepository.getRandomTeams.mockResolvedValue([{ id: 1, name: 'T1', league: 'L1' }]);
    questionRepository.getRandomPlayers.mockResolvedValue([{ id: 10, name: 'P1', team_id: 1 }]);
    questionRepository.getWrongTeamOptions.mockResolvedValue([{ id: 2, name: 'T2' }, { id: 3, name: 'T3' }]);

    const questions = await questionService.generateQuestions('timed', 2);
    
    expect(questions.length).toBe(2);
    // Verificamos que contenga ambos tipos
    const types = questions.map(q => q.questionType);
    expect(types).toContain('teams');
    expect(types).toContain('players');
  });

  test('Modo teams con FALLBACK: Debe entrar a la lógica de emergencia si faltan opciones', async () => {
    const mockTeam = { id: 1, name: 'A', league: 'L', division: 'D', logo_url: 'url' };
    questionRepository.getRandomTeams.mockResolvedValue([mockTeam]);
    
    // 1. Devolvemos solo 1 opción incorrecta para forzar el FALLBACK
    questionRepository.getWrongTeamOptions.mockResolvedValue([{ id: 2, name: 'B' }]);
    // 2. Simulamos el extra que viene del fallback
    questionRepository.getWrongTeamOptionsFallback.mockResolvedValue([{ id: 3, name: 'C' }]);

    const questions = await questionService.generateQuestions('teams', 1);

    expect(questionRepository.getWrongTeamOptionsFallback).toHaveBeenCalled();
    expect(questions[0].options.length).toBe(3); // 1 correcta + 1 normal + 1 fallback
  });

  test('Modo players: Debe saltar el jugador si no hay opciones suficientes (continue)', async () => {
    questionRepository.getRandomPlayers.mockResolvedValue([{ id: 1, team_id: 10 }]);
    // Simulamos que NO hay opciones incorrectas ni en normal ni en fallback
    questionRepository.getWrongTeamOptions.mockResolvedValue([]);
    questionRepository.getWrongTeamOptionsFallback.mockResolvedValue([]);

    const questions = await questionService.generateQuestions('players', 1);

    expect(questions.length).toBe(0); // El 'continue' funcionó
  });

  test('Modo desconocido: Debe devolver array vacío', async () => {
    const questions = await questionService.generateQuestions('random_mode');
    expect(questions).toEqual([]);
  });
});