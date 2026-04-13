const { Router } = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator.middleware');
const { verificarToken } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');
const { getProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos.controller');

const router = Router();

// GET /api/productos — usuarios autenticados
router.get('/', verificarToken, getProductos);

// POST /api/productos — solo admin/tienda
router.post('/',
  verificarToken,
  authorizeRole('tienda'),
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  ],
  validateRequest,
  crearProducto
);

// PUT /api/productos/:id — solo admin/tienda
router.put('/:id',
  verificarToken,
  authorizeRole('tienda'),
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  ],
  validateRequest,
  actualizarProducto
);

// DELETE /api/productos/:id — solo admin/tienda
router.delete('/:id',
  verificarToken,
  authorizeRole('tienda'),
  eliminarProducto
);

module.exports = router;
