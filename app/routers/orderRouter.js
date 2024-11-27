const express = require('express');
const orderController = require('../controllers/orderController');
const { validateOrderStatus } = require('../middleware/orderValidation');

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.get('/users/:id', orderController.getOrdersByUserId);
router.get(
    '/status/:userId/:movieId',
    validateOrderStatus,
    orderController.checkMovieOrderStatus
  );
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
