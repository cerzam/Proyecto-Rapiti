const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Conexión a la base de datos

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario real en la base de datos
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1", 
      [email]
    );

    const user = result.rows[0];

    // 2. Validar si el usuario existe
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 3. Validar la contraseña almacenada (Hash) contra la recibida
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 4. Generar el Token JWT (Persistencia de sesión en cliente)
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET || "secret_key_mvp",
      { expiresIn: "8h" }
    );

    // 5. GUARDAR EN REDIS (Persistencia de sesión en servidor)
    req.session.user = {
      id: user.id,
      email: user.email,
      rol: user.rol
    };

    // 6. Respuesta final
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    next(error); // Pasa el error al middleware de errores que ya tienes
  }
};

module.exports = { login };