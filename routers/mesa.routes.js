//manejando las rutas de mesa   
const express = require('express');
//constante principal para manejar rutas
const router = express.Router();    
// llamando a los metodos a sutilizar para las rutas
const { obtenerMesas,
     obtenerMesaById, 
     crearMesa } = require('../controller/mesa.controller');
     
       //creando las rutas para las mesas
       router.get('/', obtenerMesas);
       router.get('/:id', obtenerMesaById);// /api/mesas/1
       router.post('/', crearMesa);

       //exportando las rutas para usarlas en index.js
       module.exports = router; 
     
