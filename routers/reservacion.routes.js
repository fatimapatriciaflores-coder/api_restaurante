const express = require('express');
const router = express.Router();
const { crearReservacion, obtenerMisReservaciones, obtenerTodasReservaciones, cambiarEstadoReservacion, cancelarPropiaReservacion } = require('../controller/reservacion.controller');
const { verificarToken, requerirRol } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, requerirRol('cliente'), crearReservacion);
router.get('/mis', verificarToken, requerirRol('cliente'), obtenerMisReservaciones);
router.get('/', verificarToken, requerirRol('admin'), obtenerTodasReservaciones);
router.put('/:id/estado', verificarToken, requerirRol('admin'), cambiarEstadoReservacion);
router.delete('/:id', verificarToken, requerirRol('cliente'), cancelarPropiaReservacion);

module.exports = router;