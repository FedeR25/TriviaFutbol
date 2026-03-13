const authService = require('../services/authService');
const logger = require('../utils/logger');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const authController = {
  async register(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await authService.register(username, password);
      logger.info({ message: 'user_registered', userId: user.id, username });
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const { token, user } = await authService.login(username, password);
      res.cookie('token', token, COOKIE_OPTIONS);
      logger.info({ message: 'user_logged_in', userId: user.id, username });
      res.json({ token, user });
    } catch (err) {
      logger.warn({ message: 'login_failed', username: req.body.username });
      next(err);
    }
  },

  async logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada' });
  },

  async me(req, res, next) {
    try {
      const userRepository = require('../repositories/userRepository');
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: { message: 'Usuario no encontrado' } });
      }
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;