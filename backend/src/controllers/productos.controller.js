// Simulación de base de datos
let productos = [];

const crearProducto = async (req, res, next) => {
    try {
        const { nombre, precio, tienda_id } = req.body;

        // 🔎 Validar existencia en BD
        const existe = productos.find(
            p => p.nombre === nombre && p.tienda_id === tienda_id
        );

        if (existe) {
            return res.status(409).json({
                success: false,
                message: "El producto ya existe en esta tienda"
            });
        }

        const nuevoProducto = {
            id: Date.now(),
            nombre,
            precio,
            tienda_id
        };

        productos.push(nuevoProducto);

        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente",
            data: nuevoProducto
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { crearProducto };
