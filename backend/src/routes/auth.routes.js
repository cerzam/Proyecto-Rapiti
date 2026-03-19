const { Router } = require('express');
const { body } = require('express-validator');

const { validateRequest } = require('../middlewares/validator.middleware');
const { login } = require('../controllers/auth.controller');

const router = Router();

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

module.exports = router;