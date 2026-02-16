const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    // Revisamos si hubo errores en la petición
    const errors = validationResult(req);

    // Si hay errores, respondemos con 400 y explicamos qué pasó
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: "Datos inválidos",
            message: "Revisa los campos marcados en rojo",
            validationErrors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    // Si todo está bien, dejamos pasar la petición
    next();
};

module.exports = { validateRequest };