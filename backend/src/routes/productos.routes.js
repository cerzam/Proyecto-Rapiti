const { Router } = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator.middleware');
const { crearProducto } = require('../controllers/productos.controller');

const router = Router();

// POST /api/productos
router.post('/',
    [
        body('nombre')
            .notEmpty().withMessage('El nombre es obligatorio')
            .isString().withMessage('El nombre debe ser texto'),

        body('precio')
            .notEmpty().withMessage('El precio es obligatorio')
            .isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),

        body('tienda_id')
            .notEmpty().withMessage('La tienda es obligatoria')
            .isInt().withMessage('ID de tienda inválido')
    ],
    validateRequest,
    crearProducto
);

//  ERROR 500
router.get('/test-error', (req, res) => {
    throw new Error("Simulación de error");
});

//  LATENCIA
router.get('/test-latencia', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({
        success: true,
        message: "Respuesta con 2 segundos de retraso"
    });
});

module.exports = router;
