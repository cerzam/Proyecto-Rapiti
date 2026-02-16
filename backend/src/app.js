const express = require('express');
const cors = require('cors');
const app = express();
const productosRoutes = require('./routes/productos.routes'); // Importamos la ruta que crearemos

app.use(express.json()); // Para entender JSON
app.use(cors()); // Para que el Frontend pueda conectarse

// Usamos las rutas
app.use('/api/productos', productosRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: "Backend de Rapiti funcionando" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});