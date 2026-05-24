import express from 'express';
import { createOrder, getOrderById, getAllOrders, mockPay } from '../controllers/orderController.js';

const router = express.Router();

// Tạo đơn hàng mới
router.post('/', createOrder);

// Lấy toàn bộ đơn hàng (quản trị/kiểm thử)
router.get('/', getAllOrders);

// Lấy chi tiết đơn hàng
router.get('/:id', getOrderById);

// Endpoint mock payment redirect
router.get('/mock-pay/:orderId', mockPay);

export default router;
