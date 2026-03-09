const delayMiddleware = async (req, res, next) => {

    // No aplicar delay en producción
    if (process.env.NODE_ENV === 'production') {
        return next();
    }

    // Leer delay desde query param (?delay=2000)
    const delay = parseInt(req.query.delay) || 0;

    if (!delay) {
        return next();
    }

    await new Promise(resolve => setTimeout(resolve, delay));

    next();
};

module.exports = { delayMiddleware };