// src/config/swagger.js

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Opciones de configuración para Swagger
const options = {
  definition: {
    openapi: '3.0.0', // Versión de OpenAPI (estándar de documentación de APIs)
    info: {
      title: 'Todo API Documentation', // Título de tu API
      version: '1.0.0', // Versión de tu API
      description: 'API REST para gestión de tareas con autenticación JWT',
      contact: {
        name: 'Esteban Brenes Rivera',
        email: 'esjriveras@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL base de tu API
        description: 'Servidor de desarrollo',
      },
      // Puedes agregar más servidores (staging, producción)
      // {
      //   url: 'https://api.tuapp.com',
      //   description: 'Servidor de producción',
      // },
    ],
    // Configuración de seguridad (JWT)
    components: {
      securitySchemes: {
        bearerAuth: { // Nombre que usarás en tus rutas
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT en el formato: Bearer {token}',
        },
      },
      // Aquí puedes definir schemas reutilizables
      schemas: {
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID autogenerado de la tarea',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Título de la tarea',
              example: 'Completar proyecto',
            },
            description: {
              type: 'string',
              description: 'Descripción detallada de la tarea',
              example: 'Finalizar el backend del sistema de tareas',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              description: 'Estado actual de la tarea',
              example: 'pending',
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              description: 'Prioridad de la tarea',
              example: 'High',
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Fecha límite',
              example: '2025-12-31',
            },
            userId: {
              type: 'integer',
              description: 'ID del usuario propietario',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
            message: {
              type: 'string',
              example: 'Detailed error description',
            },
          },
        },
      },
    },
  },
  // Archivos donde Swagger buscará la documentación
  apis: ['./src/routes/*.js'],
};

// Genera el objeto de especificación Swagger
const swaggerSpec = swaggerJsdoc(options);

// Función para configurar Swagger en tu app Express
export const setupSwagger = (app) => {
  // Ruta para la UI de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }', // Oculta el banner de Swagger
    customSiteTitle: 'Todo API Docs', // Título de la pestaña del navegador
  }));
  
  // Ruta para obtener el JSON de Swagger (útil para importar en Postman)
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger UI disponible en: http://localhost:3000/api-docs');
  console.log('Swagger JSON disponible en: http://localhost:3000/api-docs.json');
};