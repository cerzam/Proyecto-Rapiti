require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Middlewares
const { delayMiddleware } = require('./middlewares/delay.middleware');
const { errorHandler } = require('./middlewares/errorHandler.middleware');

// Rutas
const authRoutes = require('./routes/auth.routes');     
const productosRoutes = require('./routes/productos.routes'); 
const testRoutes = require('./routes/test.routes'); 

const app = express();

// Uso helmet al inicio para proteción de todas las rutas
app.use(helmet());
app.set('trust proxy', 1); // <--- Para poder detectar IPs reales tras un proxy

// Middleware global
app.use(express.json()); 
app.use(cors()); 
app.use(delayMiddleware);

// Rutas
app.use('/api/auth', authRoutes);        // Login / registro
app.use('/api/productos', productosRoutes);
app.use('/api/test', testRoutes);        // GET /api/test/admin-test y /test-error

// Ruta base
app.get('/', (req, res) => {
    res.json({ message: "Backend de Rapiti funcionando" });
});

// Middleware global de errores
app.use(errorHandler);

module.exports = app;