const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sessions, cleanExpiredSessions } = require('../config/sessions');
const { recoveryTokens, cleanExpiredRecoveryTokens, EXPIRATION_MS } = require('../config/recovery-tokens');

const MAX_SESSIONS_PER_USER = 5;

// Usuario de prueba (MVP)
const user = {
  id: 1,
  email: "tienda@rapiti.com",
  // Hash de la contraseña "12345678"
  password: "$2b$10$ihh59xeHkK5VXgdmBSL3Xe1Bnp1UB6E65JuDHBUSKiSmcl5jCdOzK",
  rol: "tienda"
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar email
    if (email !== user.email) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Validar contraseña usando bcrypt
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET || "secret_key_mvp",
      { expiresIn: "8h" }
    );

    // Limpiar expiradas antes de contar
    cleanExpiredSessions();

    // Si el usuario ya tiene el máximo de sesiones, eliminar la más antigua
    const userSessions = sessions.filter(s => s.userId === user.id);
    if (userSessions.length >= MAX_SESSIONS_PER_USER) {
      const oldest = userSessions[0];
      const idx = sessions.indexOf(oldest);
      sessions.splice(idx, 1);
    }

    // GUARDAR SESIÓN (MULTISESIÓN)
    sessions.push({
      userId: user.id,
      token,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8h en ms
    });

    res.json({
      token,
      user: {
        id: user.id,
        rol: user.rol
      }
    });

  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Mensaje siempre igual — no revela si el email existe
    const mensaje = "Si ese correo está registrado, recibirás las instrucciones.";

    if (email !== user.email) {
      return res.status(200).json({ message: mensaje });
    }

    cleanExpiredRecoveryTokens();

    // Eliminar tokens previos del mismo usuario
    const idx = recoveryTokens.findIndex(t => t.userId === user.id);
    if (idx !== -1) recoveryTokens.splice(idx, 1);

    // Generar token criptográficamente seguro
    const token = crypto.randomBytes(32).toString('hex');

    recoveryTokens.push({
      userId: user.id,
      token,
      expiresAt: Date.now() + EXPIRATION_MS
    });

    // En producción real se enviaría por email.
    // En desarrollo devolvemos el token para poder demostrar el flujo.
    return res.status(200).json({
      message: mensaje,
      _devToken: token // solo en desarrollo
    });

  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    cleanExpiredRecoveryTokens();

    const entry = recoveryTokens.find(t => t.token === token);

    if (!entry) {
      return res.status(400).json({ message: "El enlace no es válido o ya expiró." });
    }

    // Hashear la nueva contraseña y actualizar el usuario en memoria
    user.password = await bcrypt.hash(password, 10);

    // Invalidar el token — uso único
    const idx = recoveryTokens.indexOf(entry);
    recoveryTokens.splice(idx, 1);

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });

  } catch (error) {
    next(error);
  }
};

module.exports = { login, forgotPassword, resetPassword };