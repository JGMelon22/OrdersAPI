const express = require('express');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rotas
app.use('/order', orderRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API está funcionando'
    });
});

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        details: err.message
    });
});

module.exports = app;