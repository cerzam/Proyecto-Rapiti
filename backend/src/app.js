require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redisClient = require("./config/redis"); // Asegúrate que aquí hagas redisClient.connect()
const pool = require("./config/db");

// Middlewares
const { delayMiddleware } = require("./middlewares/delay.middleware");
const { errorHandler } = require("./middlewares/errorHandler.middleware");

// Rutas
const authRoutes = require("./routes/auth.routes");
const productosRoutes = require("./routes/productos.routes");
const testRoutes = require("./routes/test.routes");

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES GLOBALES ---
// Nota: Express.json y CORS suelen ir antes que la sesión para evitar problemas de parsing
app.use(express.json());
app.use(cors());
app.use(delayMiddleware);

// --- CONFIGURACIÓN DE SESIÓN CON REDIS ---
app.use(
  session({
    // Instanciamos el Store pasando el cliente de Redis directamente
    store: new RedisStore({
      client: redisClient,
    }),
    secret:
      process.env.SESSION_SECRET ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMjYzMDI2MyIsIm5hbWUiOiJSQVBJVEktU0VTU0lPTiIsImFkbWluIjp0cnVlLCJpYXQiOjEyMzQ1Njc4fQ.oH_LEiLAgL_vBgQY6MjyjYavBy1YpKww210pjoqURBo",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // En producción, esto debería ser true si usas HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  }),
);

// --- RUTAS ---
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/test", testRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.json({ message: "Backend de Rapiti funcionando con sesiones de Redis" });
});

// RUTA DE PRUEBA DE PERSISTENCIA (POSTGRESQL)
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Conexión exitosa con PostgreSQL",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en /test-db:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Middleware global de errores (Siempre debe ser el último middleware)
app.use(errorHandler);

module.exports = app;
