const express = require('express');
const router = express.Router();
const { getTiendas, getTienda, crearTienda, actualizarTienda, eliminarTienda } = require('../controllers/tiendas.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');

router.get('/',     getTiendas);
router.get('/:id',  getTienda);
router.post('/',    verificarToken, authorizeRole('admin'), crearTienda);
router.put('/:id',  verificarToken, authorizeRole('admin'), actualizarTienda);
router.delete('/:id', verificarToken, authorizeRole('admin'), eliminarTienda);

module.exports = router;
