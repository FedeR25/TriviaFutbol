const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middlewares/auth');

router.get('/users', authenticate, isAdmin, adminController.listUsers);
router.put('/users/:id/reset-password', authenticate, isAdmin, adminController.resetPassword);

module.exports = router;