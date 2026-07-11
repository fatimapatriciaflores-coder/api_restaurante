const express = require('express')
const app = express()
// llamando a las rutas de mesa
const mesaRoutes = require('./routers/mesa.routes')
app.use(express.json())

app.listen(3000, () => {
    console.log("Hola, este es el servidor http://localhost:3000/")
})

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenidos a la API de Restaurante',
        descripcion: 'API que gestiona mesas y reservaciones en base al rol del usuario',
        version: '1.0.0',
    })
})

// usando las rutas de mesas
app.use('/api/mesas', mesaRoutes)
