const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');

const adminController = {
  async listUsers(req, res, next) {
    try {
      const users = await userRepository.findAll();
      res.json({ users });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(parseInt(id));

      if (!user) {
        return res.status(404).json({ error: { message: 'Usuario no encontrado' } });
      }

      const tempPassword = await authService.resetPassword(parseInt(id));

      logger.info({
        message: 'password_reset_by_admin',
        adminId: req.user.id,
        targetUserId: id
      });

      res.json({
        message: 'Contraseña reseteada correctamente',
        tempPassword,
        username: user.username
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminController;