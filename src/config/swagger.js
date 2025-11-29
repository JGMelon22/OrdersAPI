const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gerenciamento de Pedidos',
            version: '1.0.0',
            description: 'API para criar, ler, atualizar e deletar pedidos',
            contact: {
                name: 'Suporte',
                email: 'suporte@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        tags: [
            {
                name: 'Orders',
                description: 'Operações relacionadas a pedidos'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;