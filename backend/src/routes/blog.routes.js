const { Router } = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator.middleware');
const { verificarToken } = require('../middlewares/auth.middleware');
const { getPosts, getPost, crearPost, actualizarPost, eliminarPost } = require('../controllers/blog.controller');

const router = Router();

// GET /api/blog — público
router.get('/', getPosts);

// GET /api/blog/:id — público
router.get('/:id', getPost);

// POST /api/blog — solo autenticados
router.post('/',
  verificarToken,
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('content').notEmpty().withMessage('El contenido es obligatorio'),
  ],
  validateRequest,
  crearPost
);

// PUT /api/blog/:id — solo autor o admin
router.put('/:id',
  verificarToken,
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('content').notEmpty().withMessage('El contenido es obligatorio'),
  ],
  validateRequest,
  actualizarPost
);

// DELETE /api/blog/:id — solo autor o admin
router.delete('/:id', verificarToken, eliminarPost);

module.exports = router;
