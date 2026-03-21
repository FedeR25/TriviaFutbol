const authService = require('../src/services/authService');
// Corregimos la ruta: desde /tests, subimos uno y entramos a /src/repositories
const userRepository = require('../src/repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mocks: bloqueamos las llamadas a la DB y a librerías externas
jest.mock('../src/repositories/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authService', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('Debe lanzar error si el usuario ya existe (Escenario 409)', async () => {
      userRepository.findByUsername.mockResolvedValue({ id: 1, username: 'admin' });

      await expect(
        authService.register('admin', 'password123')
      ).rejects.toThrow('El nombre de usuario ya existe');
    });

    test('Debe registrar exitosamente si el nombre está disponible', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hash_seguro');
      userRepository.create.mockResolvedValue({ id: 5, username: 'fede' });

      const user = await authService.register('fede', 'password123');
      
      expect(user.username).toBe('fede');
      expect(userRepository.create).toHaveBeenCalledWith('fede', 'hash_seguro');
    });
  });

  describe('login', () => {
    test('Debe fallar si el usuario no existe', async () => {
      userRepository.findByUsername.mockResolvedValue(null);

      await expect(
        authService.login('no_existo', '123')
      ).rejects.toThrow('Usuario o contraseña incorrectos');
    });

    test('Debe fallar si la contraseña no coincide', async () => {
      userRepository.findByUsername.mockResolvedValue({ id: 1, password_hash: 'hash_real' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login('admin', 'wrong_pass')
      ).rejects.toThrow('Usuario o contraseña incorrectos');
    });

    test('Debe generar un token si todo es correcto', async () => {
      const mockUser = { id: 1, username: 'admin', password_hash: 'hash', is_admin: true };
      userRepository.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token_valido_123');

      const result = await authService.login('admin', 'pass123');

      expect(result.token).toBe('token_valido_123');
      expect(result.user.is_admin).toBe(true);
    });
  });
});