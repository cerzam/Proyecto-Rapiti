const { Router } = require('express');
const router = Router();

// GET /api/test-error
router.get('/test-error', (req, res, next) => {
    try {
        // Tu tarea pide lanzar este error exacto:
        throw new Error("Simulación de error");
    } catch (error) {
        // Al pasar el error a next(), lo mandamos directo al errorHandler global
        next(error); 
    }
});

module.exports = router;