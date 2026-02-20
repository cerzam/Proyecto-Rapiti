const errorHandler = (err, req, res, next) => {
    console.error("Error detectado:", err.message);

    // Si el error no tiene un status code definido, asumimos que es un 500
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? "Internal Server Error" : "Error de Petición",
        message: err.message || "Ocurrió un error inesperado en el servidor."
    });
};

module.exports = { errorHandler };