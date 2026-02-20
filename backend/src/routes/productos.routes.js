const { Router } = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validator.middleware');
// AQUÍ IMPORTAMOS EL CONTROLADOR
const { crearProducto } = require('../controllers/productos.controller');

const router = Router();

// Datos de prueba para el MVP

const productosDemo = [
    {
        id: 1,
        title: "Leche Lala 1L",
        price: 28.50,
        image: "https://arteli.vtexassets.com/arquivos/ids/258200/7501020526066_02.jpg?v=638635810988400000",
        tienda: "Oxxo Centro"
    },
    {
        id: 2,
        title: "Pan Bimbo Grande",
        price: 45.00,
        image: "https://www.mayoreototal.mx/cdn/shop/files/Capturadepantalla2024-11-04ala_s_6.29.48a.m._1024x1024@2x.png?v=1730723418",
        tienda: "Walmart Angelópolis"
    },
    {
        id: 3,
        title: "Huevo San Juan 12pz",
        price: 52.90,
        image: "https://res.cloudinary.com/riqra/image/upload/v1668469336/sellers/7/ackv0tvbffgnzzres4pw.jpg",
        tienda: "Bodega Aurrera"
    },
    {
        id: 4,
        title: "Aceite 123 1L",
        price: 38.00,
        image: "https://carritolatino.com/cdn/shop/files/1_25cb48a4-380d-4a40-9a01-d81b0b13d4ee.png?v=1756873015",
        tienda: "Oxxo Centro"
    },
    {
        id: 5,
        title: "Arroz Verde Valle 1kg",
        price: 29.50,
        image: "https://superlavioleta.com/cdn/shop/files/PrecoMexicana140g.png?v=1753108914",
        tienda: "Chedraui"
    },
    {
        id: 6,
        title: "Frijoles La Costeña 560g",
        price: 22.00,
        image: "https://www.pidefacilraul.com/cms/wp-content/uploads/2022/09/12-098.jpg",
        tienda: "Walmart Angelópolis"
    }
];

router.get('/', (req, res) => {
    res.json({
        success: true,
        count: productosDemo.length,
        data: productosDemo
    });
});

// POST /api/productos
router.post('/', 
    [
        // Reglas de validación (Middleware 1)
        body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
        body('tienda_id').isInt().withMessage('ID de tienda inválido')
    ],
    validateRequest, // Middleware 2: Revisa si pasaron las reglas
    crearProducto    // Controlador: Si todo pasó, ejecuta tu lógica
);

module.exports = router;