require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Middlewares
const { delayMiddleware } = require('./middlewares/delay.middleware');
const { errorHandler } = require('./middlewares/errorHandler.middleware');

// Rutas
const authRoutes = require('./routes/auth.routes');     
const productosRoutes = require('./routes/productos.routes'); 
const testRoutes = require('./routes/test.routes'); 

const app = express();

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