const authorizeRole = (rolPermitido) => {
  return (req, res, next) => {

    // verificar que exista usuario autenticado
    if (!req.user) {
      return res.status(401).json({
        message: "No autenticado"
      });
    }

    // verificar rol
    if (req.user.rol !== rolPermitido) {
      return res.status(403).json({
        message: "Acceso denegado"
      });
    }

    // si todo está bien
    next();
  };
};

module.exports = { authorizeRole };