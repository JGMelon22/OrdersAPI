const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/list', orderController.listOrders.bind(orderController));
router.post('/', orderController.createOrder.bind(orderController));
router.get('/:orderId', orderController.getOrderById.bind(orderController));
router.put('/:orderId', orderController.updateOrder.bind(orderController));
router.delete('/:orderId', orderController.deleteOrder.bind(orderController));

module.exports = router;