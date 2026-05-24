import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Lấy danh sách sản phẩm
router.get('/', getAllProducts);

// Lấy chi tiết sản phẩm
router.get('/:id', getProductById);

// Tạo mới sản phẩm
router.post('/', createProduct);

// Cập nhật sản phẩm
router.put('/:id', updateProduct);

// Xóa sản phẩm
router.delete('/:id', deleteProduct);

export default router;
