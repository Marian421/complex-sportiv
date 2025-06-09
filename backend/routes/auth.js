const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const validate = require('../middleware/validate');
const {
  registerSchema,
  loginSchema,
  resetSchema,
  verifyCodeSchema,
  newPasswordSchema
} = require('../validators/authValidator');

router.post('/register', validate(registerSchema) ,authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/reset', validate(resetSchema), authController.reset);
router.post('/verify-reset-code', validate(verifyCodeSchema), authController.verifyResetCode);
router.post('/reset-password', validate(newPasswordSchema), authenticateToken, authController.resetPassword);
router.get('/me', authenticateToken, authController.getMe);
router.post('/logout', authController.logout);
router.delete('/delete-account', authenticateToken, authController.deleteAccount);

module.exports = router;
