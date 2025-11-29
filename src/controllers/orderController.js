const orderService = require('../services/orderService');

class OrderController {
    async createOrder(req, res) {
        try {
            const orderData = req.body;

            if (!orderData.numeroPedido || !orderData.valorTotal || !orderData.dataCriacao || !orderData.items) {
                return res.status(400).json({
                    error: 'Dados incompletos. Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items'
                });
            }

            if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
                return res.status(400).json({
                    error: 'O pedido deve conter pelo menos um item'
                });
            }

            const order = await orderService.createOrder(orderData);

            res.status(201).json({
                message: 'Pedido criado com sucesso',
                order
            });
        } catch (error) {
            console.error('Erro ao criar pedido:', error);

            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({
                    error: 'Pedido com este número já existe'
                });
            }

            res.status(500).json({
                error: 'Erro ao criar pedido',
                details: error.message
            });
        }
    }


    async getOrderById(req, res) {
        try {
            const { orderId } = req.params;
            const order = await orderService.getOrderById(orderId);

            if (!order) {
                return res.status(404).json({
                    error: 'Pedido não encontrado'
                });
            }

            res.status(200).json(order);
        } catch (error) {
            console.error('Erro ao buscar pedido:', error);
            res.status(500).json({
                error: 'Erro ao buscar pedido',
                details: error.message
            });
        }
    }

    async listOrders(req, res) {
        try {
            const orders = await orderService.listOrders();

            res.status(200).json({
                total: orders.length,
                orders
            });
        } catch (error) {
            console.error('Erro ao listar pedidos:', error);
            res.status(500).json({
                error: 'Erro ao listar pedidos',
                details: error.message
            });
        }
    }

    async updateOrder(req, res) {
        try {
            const { orderId } = req.params;
            const orderData = req.body;

            if (!orderData.numeroPedido || !orderData.valorTotal || !orderData.dataCriacao || !orderData.items) {
                return res.status(400).json({
                    error: 'Dados incompletos. Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items'
                });
            }

            const updatedOrder = await orderService.updateOrder(orderId, orderData);

            if (!updatedOrder) {
                return res.status(404).json({
                    error: 'Pedido não encontrado'
                });
            }

            res.status(200).json({
                message: 'Pedido atualizado com sucesso',
                order: updatedOrder
            });
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            res.status(500).json({
                error: 'Erro ao atualizar pedido',
                details: error.message
            });
        }
    }

    async deleteOrder(req, res) {
        try {
            const { orderId } = req.params;
            const deleted = await orderService.deleteOrder(orderId);

            if (!deleted) {
                return res.status(404).json({
                    error: 'Pedido não encontrado'
                });
            }

            res.status(200).json({
                message: 'Pedido deletado com sucesso'
            });
        } catch (error) {
            console.error('Erro ao deletar pedido:', error);
            res.status(500).json({
                error: 'Erro ao deletar pedido',
                details: error.message
            });
        }
    }
}

module.exports = new OrderController();