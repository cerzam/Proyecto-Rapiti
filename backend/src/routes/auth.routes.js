const { Router } = require('express');
const { body } = require('express-validator');

const { validateRequest } = require('../middlewares/validator.middleware');
const { login } = require('../controllers/auth.controller');
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

module.exports = router;