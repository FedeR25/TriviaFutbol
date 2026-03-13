const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const logger = require('../utils/logger');

const authenticate = (req, res, next) => {
  // Aceptar token por cookie O por header Authorization
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) {
    return res.status(401).json({ 
      error: { message: 'No autenticado' } 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn({ message: 'JWT inválido', error: err.message });
    return res.status(401).json({ 
      error: { message: 'Sesión inválida o expirada' } 
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ 
      error: { message: 'Acceso denegado' } 
    });
  }
  next();
};

module.exports = { authenticate, isAdmin };