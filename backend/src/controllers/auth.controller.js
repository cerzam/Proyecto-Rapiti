const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sessions, cleanExpiredSessions } = require('../config/sessions');

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

module.exports = { login };