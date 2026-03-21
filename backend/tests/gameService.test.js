const gameService = require('../src/services/gameService');
const gameRepository = require('../src/repositories/gameRepository');

// Simulamos el repositorio
jest.mock('../src/repositories/gameRepository');

describe('gameService - submitAnswer', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // IMPORTANTE: Cerramos la conexión al terminar
  test('Debe lanzar error si la sesión ya está completada', async () => {
    gameRepository.findSessionById.mockResolvedValue({
      id: 1,
      user_id: 10,
      completed: true
    });

    await expect(
      gameService.submitAnswer(1, 10, 'q1', 'teams', 'ans1', 1000)
    ).rejects.toThrow('La partida ya terminó');
  });

  test('Debe lanzar error si el tiempo de respuesta es inválido (negativo)', async () => {
    gameRepository.findSessionById.mockResolvedValue({
      id: 1,
      user_id: 10,
      completed: false
    });

    await expect(
      gameService.submitAnswer(1, 10, 'q1', 'teams', 'ans1', -500)
    ).rejects.toThrow('Tiempo de respuesta inválido');
  });

  test('Debe calcular correctamente una respuesta correcta de tipo teams', async () => {
    gameRepository.findSessionById.mockResolvedValue({
      id: 1,
      user_id: 10,
      completed: false,
      correct_answers: 0,
      wrong_answers: 0,
      penalty_ms: 0,
      questions_answered: 0
    });
    
    gameRepository.wasQuestionAnswered.mockResolvedValue(false);

    const result = await gameService.submitAnswer(1, 10, 'team_A', 'teams', 'team_A', 2000);

    expect(result.isCorrect).toBe(true);
    expect(result.penaltyMs).toBe(0);
  });


  describe('getResult', () => {
    test('Debe retornar la sesión si existe y pertenece al usuario', async () => {
      const mockSession = { id: 1, user_id: 1, mode: 'classic' };
      gameRepository.findSessionById.mockResolvedValue(mockSession);

      const result = await gameService.getResult(1, 1);
      expect(result).toEqual(mockSession);
    });

    test('Debe lanzar error si la sesión no existe en getResult', async () => {
      gameRepository.findSessionById.mockResolvedValue(null);
      await expect(gameService.getResult(999, 1)).rejects.toThrow('Sesión no encontrada');
    });
  });

  describe('submitAnswer - Casos Negativos', () => {
    test('Debe marcar como incorrecto si el equipo no coincide', async () => {
      const mockSession = { id: 1, user_id: 1, completed: false, correct_answers: 0, wrong_answers: 0, penalty_ms: 0, questions_answered: 0 };
      gameRepository.findSessionById.mockResolvedValue(mockSession);
      gameRepository.wasQuestionAnswered.mockResolvedValue(false);

      // answerGiven (99) diferente a questionRefId (1)
      const result = await gameService.submitAnswer(1, 1, 1, 'teams', 99, 1000);
      
      expect(result.isCorrect).toBe(false);
      expect(result.penaltyMs).toBe(5000); // Verifica que se aplique la penalidad
    });
  });
});