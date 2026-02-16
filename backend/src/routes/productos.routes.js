const { Router } = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator.middleware');
// AQUÍ IMPORTAMOS EL CONTROLADOR
const { crearProducto } = require('../controllers/productos.controller');

const router = Router();

// POST /api/productos
router.post('/', 
    [
        // Reglas de validación (Middleware 1)
        body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
        body('tienda_id').isInt().withMessage('ID de tienda inválido')
    ],
    validateRequest, // Middleware 2: Revisa si pasaron las reglas
    crearProducto    // Controlador: Si todo pasó, ejecuta tu lógica
);

module.exports = router;