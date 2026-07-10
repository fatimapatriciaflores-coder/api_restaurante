const express = require('express');
const router = express.Router();
const { obtenerMesas, obtenerMesaById, crearMesa, actualizarMesa, desactivarMesa } = require('../controller/mesa.controller');
const { verificarToken, requerirRol } = require('../middlewares/auth.middleware');

router.get('/', obtenerMesas);
router.get('/:id', obtenerMesaById);
router.post('/', verificarToken, requerirRol('admin'), crearMesa);
router.put('/:id', verificarToken, requerirRol('admin'), actualizarMesa);
router.delete('/:id', verificarToken, requerirRol('admin'), desactivarMesa);

module.exports = router;
