const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { sessions, cleanExpiredSessions } = require('../config/sessions');
const { recoveryTokens, cleanExpiredRecoveryTokens, EXPIRATION_MS } = require('../config/recovery-tokens');

const MAX_SESSIONS_PER_USER = 5;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario en MySQL
    const [rows] = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = rows[0];

    const passwordValida = await bcrypt.compare(password, user.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.role },
      process.env.JWT_SECRET || 'secret_key_mvp',
      { expiresIn: '8h' }
    );

    cleanExpiredSessions();

    const userSessions = sessions.filter(s => s.userId === user.id);
    if (userSessions.length >= MAX_SESSIONS_PER_USER) {
      const oldest = userSessions[0];
      sessions.splice(sessions.indexOf(oldest), 1);
    }

    sessions.push({
      userId: user.id,
      token,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000
    });

    res.json({
      token,
      user: { id: user.id, rol: user.role }
    });

  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const mensaje = 'Si ese correo está registrado, recibirás las instrucciones.';

    const [rows] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(200).json({ message: mensaje });
    }

    const user = rows[0];

    cleanExpiredRecoveryTokens();

    const idx = recoveryTokens.findIndex(t => t.userId === user.id);
    if (idx !== -1) recoveryTokens.splice(idx, 1);

    const token = crypto.randomBytes(32).toString('hex');

    recoveryTokens.push({
      userId: user.id,
      token,
      expiresAt: Date.now() + EXPIRATION_MS
    });

    return res.status(200).json({
      message: mensaje,
      _devToken: token
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
      return res.status(400).json({ message: 'El enlace no es válido o ya expiró.' });
    }

    const newHash = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newHash, entry.userId]
    );

    recoveryTokens.splice(recoveryTokens.indexOf(entry), 1);

    return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });

  } catch (error) {
    next(error);
  }
};

module.exports = { login, forgotPassword, resetPassword };
