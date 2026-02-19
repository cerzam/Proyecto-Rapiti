const express = require('express');
const cors = require('cors');
const app = express();
const productosRoutes = require('./routes/productos.routes');

app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/productos', productosRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: "Backend de Rapiti funcionando" });
});


// 🔥 Middleware global de errores (DEBE IR AL FINAL)
app.use((err, req, res, next) => {
    console.error("🔥 Error capturado:", err.message);

    res.status(500).json({
        success: false,
        message: "Error interno del servidor"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
