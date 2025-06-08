const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset', authController.reset);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authenticateToken, authController.resetPassword);
router.get('/me', authenticateToken, authController.getMe);
router.post('/logout', authController.logout);
router.delete('/delete-account', authenticateToken, authController.deleteAccount);

module.exports = router;
