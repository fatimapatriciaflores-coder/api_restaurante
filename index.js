const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const mesaRoutes = require('./routers/mesa.routes');
const authRoutes = require('./routers/auth.routes');
const reservacionRoutes = require('./routers/reservacion.routes');

app.use(express.json());

// Configuración básica de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST Restaurante',
            version: '1.0.0',
            description: 'Sistema de reservaciones con roles y JWT',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./routers/*.js'], // Buscará documentación en las rutas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mapeo de Endpoints
app.use('/api/mesas', mesaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservaciones', reservacionRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenidos a la API de Restaurante',
        documentacion: 'Ver en http://localhost:3000/api-docs'
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo con éxito en http://localhost:3000/");
    console.log("Documentación interactiva en http://localhost:3000/api-docs");
});