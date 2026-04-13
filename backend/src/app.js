require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Middlewares
const { delayMiddleware } = require('./middlewares/delay.middleware');
const { errorHandler } = require('./middlewares/errorHandler.middleware');

// Rutas
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const blogRoutes = require('./routes/blog.routes');
const testRoutes = require('./routes/test.routes');

const app = express();

// Middleware global
app.use(express.json()); 
app.use(cors()); 
app.use(delayMiddleware);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/test', testRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.json({ message: "Backend de Rapiti funcionando" });
});

// Middleware global de errores
app.use(errorHandler);

module.exports = app;