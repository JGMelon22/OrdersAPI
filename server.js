const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\nServidor rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`\nEndpoints disponíveis:`);
    console.log(`  POST   http://localhost:${PORT}/order`);
    console.log(`  GET    http://localhost:${PORT}/order/:orderId`);
    console.log(`  GET    http://localhost:${PORT}/order/list`);
    console.log(`  PUT    http://localhost:${PORT}/order/:orderId`);
    console.log(`  DELETE http://localhost:${PORT}/order/:orderId`);
    console.log(`  GET    http://localhost:${PORT}/health`);;
});