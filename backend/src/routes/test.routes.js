const { Router } = require('express');
const { verificarToken } = require('../middlewares/auth.middleware'); // tu middleware JWT

const router = Router();

// Ruta de prueba protegida: GET /api/test/admin-test
router.get('/admin-test', verificarToken, (req, res) => {
    res.json({
        message: 'Acceso permitido',
        user: req.user
    });
});

// Ruta de prueba de error: GET /api/test/test-error
router.get('/test-error', (req, res, next) => {
    try {
        // Lanza error para probar errorHandler
        throw new Error("Simulación de error");
    } catch (error) {
        next(error); 
    }
});

module.exports = router;