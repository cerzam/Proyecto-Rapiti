// Este middleware frena la petición 2 segundos antes de continuar
const delayMiddleware = async (req, res, next) => {
    // Simula latencia de 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));
    next(); // Después de esperar, deja pasar la petición
};

module.exports = { delayMiddleware };