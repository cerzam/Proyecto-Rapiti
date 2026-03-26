const jwt = require('jsonwebtoken');
const { sessions, cleanExpiredSessions } = require('../config/sessions');

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Token faltante" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token inválido" });

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_mvp");

    // Limpiar sesiones expiradas antes de validar
    cleanExpiredSessions();

    // 🔥 VALIDAR SESIÓN (MULTISESIÓN)
    const sessionExists = sessions.find(s => s.token === token);

    if (!sessionExists) {
      return res.status(401).json({ message: "Sesión inválida" });
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = { verificarToken };