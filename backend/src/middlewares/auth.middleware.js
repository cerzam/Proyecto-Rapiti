const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Token faltante" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token inválido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_mvp");
    req.user = decoded; // Guardamos id y rol en req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = { verificarToken };