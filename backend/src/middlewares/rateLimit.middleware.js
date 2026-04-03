const rateLimit = require('express-rate-limit');

const recoverLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, 
    message: {
        status: 429,
        message: "Demasiados intentos de acceso desde esta IP. Inténtalo de nuevo en 15 minutos."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { recoverLimiter };