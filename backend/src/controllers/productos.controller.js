// Simulamos una base de datos por ahora
const crearProducto = (req, res) => {
    const { nombre, precio, tienda_id } = req.body;

    // Aquí ira la lógica de guardar en PostgreSQL
    console.log("Guardando en BD:", nombre);

    res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        data: {
            id: Date.now(), // ID simulado
            nombre,
            precio,
            tienda_id
        }
    });
};

module.exports = { crearProducto };