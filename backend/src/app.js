require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const express = require('express');
const cors = require('cors');

// 1. Importar nuevos middlewares
const { delayMiddleware } = require('./middlewares/delay.middleware');
const { errorHandler } = require('./middlewares/errorHandler.middleware');

// 2. Importar rutas
const productosRoutes = require('./routes/productos.routes'); 
const testRoutes = require('./routes/test.routes'); // Error 500

const app = express();

app.use(express.json()); 
app.use(cors()); 

// 3. LATENCIA GLOBAL
app.use(delayMiddleware);

// 4. ZONA DE RUTAS
app.use('/api/auth', authRoutes);      // ← AQUÍ agregas tu login
app.use('/api/productos', productosRoutes);
app.use('/api/test', testRoutes); // GET /api/test/test-error

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: "Backend de Rapiti funcionando" });
});

// 5. MIDDLEWARE GLOBAL DE ERRORES
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});