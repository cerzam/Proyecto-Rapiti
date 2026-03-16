const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Usuario de ejemplo (MVP)
    const user = {
      id: 1,
      email: "tienda@rapiti.com",
      password: "$2b$10$1234567890123456789012", 
      rol: "tienda"
    };

    // validar contraseña
    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({
        message: "Credenciales inválidas"
      });
    }

    // generar JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

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