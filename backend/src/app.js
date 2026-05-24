import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { stripeWebhook } from './controllers/orderController.js';
import { seedDefaultProducts } from './controllers/productController.js';

// Load environment variables
dotenv.config();

// Tự động nạp dữ liệu hạt giống khi khởi chạy
seedDefaultProducts();

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// ROUTE STRIPE WEBHOOK (Phải đứng trước express.json() để nhận raw body)
app.post(
  '/api/webhook/payment',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Middleware phân tích JSON cho các route khác
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Đăng ký route chính
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Chỉ chạy lắng nghe cổng nếu không phải môi trường test Jest
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Backend đang chạy tại http://localhost:${PORT}`);
    console.log(`[Server] CORS cho phép nguồn từ: ${corsOptions.origin}`);
  });
}

export default app;
