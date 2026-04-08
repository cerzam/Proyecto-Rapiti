require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Middlewares
const { delayMiddleware } = require('./middlewares/delay.middleware');
const { errorHandler } = require('./middlewares/errorHandler.middleware');

// Rutas
const authRoutes = require('./routes/auth.routes');     
const productosRoutes = require('./routes/productos.routes'); 
const testRoutes = require('./routes/test.routes'); 

const app = express();

// --- CONFIGURACIÓN DE LOGS Y SEGURIDAD ---

// Configuración según el entorno
if (process.env.NODE_ENV === 'production') {
    // Formato 'combined' para producción (estándar Apache/Nginx)
    app.use(morgan('combined'));
} else {
    // Formato 'dev' para desarrollo (con colores y más simple)
    app.use(morgan('dev'));
}

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