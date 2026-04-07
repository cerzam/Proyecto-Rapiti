const { Router } = require('express');
const { body } = require('express-validator');

const { validateRequest } = require('../middlewares/validator.middleware');
const { login, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { sessions } = require('../config/sessions');

const router = Router();

// LOGIN
router.post(
  '/login',
  [
    body('email')
      .notEmpty()
      .withMessage('El correo es obligatorio')
      .isEmail()
      .withMessage('Formato de correo inválido'),

    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
      .isLength({ min: 8, max: 128 })
      .withMessage('La contraseña debe tener entre 8 y 128 caracteres')
  ],
  validateRequest,
  login
);

// VERIFICAR SESIÓN (para reconexión)
router.get('/verify', verificarToken, (req, res) => {
  res.json({ valid: true });
});

// 🔥 LOGOUT (INVALIDAR SESIÓN)
router.post('/logout', verificarToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  const index = sessions.findIndex(s => s.token === token);

  if (index !== -1) {
    sessions.splice(index, 1);
  }

  res.json({ message: "Sesión cerrada correctamente" });
});

// FORGOT PASSWORD
router.post(
  '/forgot-password',
  [
    body('email')
      .notEmpty().withMessage('El correo es obligatorio')
      .isEmail().withMessage('Formato de correo inválido')
  ],
  validateRequest,
  forgotPassword
);

// RESET PASSWORD
router.post(
  '/reset-password',
  [
    body('token')
      .notEmpty().withMessage('El token es obligatorio'),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 8, max: 128 }).withMessage('La contraseña debe tener entre 8 y 128 caracteres')
  ],
  validateRequest,
  resetPassword
);

module.exports = router;