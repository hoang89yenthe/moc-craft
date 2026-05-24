# An Nhiên Crochet - Landing Page Bán Tượng Phật Móc Len

Trang Landing Page cao cấp, tối giản và có tỷ lệ chuyển đổi cao dành cho cửa hàng thủ công **An Nhiên Crochet**. Dự án được xây dựng với kiến trúc Full-stack hiện đại: Frontend (Next.js) và Backend (Express.js) tích hợp thanh toán Stripe (có chế độ Mock Sandbox).

---

## 🛠️ Kiến Trúc Hệ Thống

Hệ thống được chia thành hai phần chính độc lập:

### 1. Frontend (`/frontend`)
- **Framework**: Next.js 16.2.6 (Turbopack)
- **Styling**: Tailwind CSS v4 (Sử dụng các gam màu ấm áp, thanh tịnh: màu be ấm, màu đất nung nhạt, xanh ô liu)
- **Icons**: `lucide-react`
- **Tương tác**: Hiệu ứng confetti pháo hoa khi thanh toán thành công (`canvas-confetti`)
- **Responsive**: Thiết kế hoàn hảo cho cả thiết bị di động (đặt taplo xe hơi) và máy tính để bàn.

### 2. Backend (`/backend`)
- **Framework**: Express.js
- **Database**: SQLite (dành cho môi trường phát triển local) & Prisma ORM
- **Payment**: Tích hợp cổng Stripe (Hỗ trợ chế độ **Mock Sandbox** tự động nếu không cấu hình key Stripe thật)
- **Cổng kết nối**: Chạy trên cổng **5050** (tránh xung đột với cổng 5000 bị chiếm dụng bởi hệ thống macOS AirPlay Receiver).
- **Unit Tests**: Sử dụng **Jest** và **Supertest** với 17 test cases kiểm thử bao phủ toàn bộ API.

---

## 🚀 Hướng Dẫn Chạy Dự Án Local

### Bước 1: Khởi động Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Sao chép và cấu hình biến môi trường:
   ```bash
   cp .env.example .env
   ```
4. Đồng bộ hóa database SQLite bằng Prisma:
   ```bash
   npx prisma db push
   ```
5. Khởi động server backend ở chế độ phát triển:
   ```bash
   NODE_ENV=development node src/app.js
   ```
   *Lưu ý: Backend sẽ chạy tại: `http://localhost:5050`*

### Bước 2: Khởi động Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Sao chép và cấu hình biến môi trường:
   ```bash
   cp .env.example .env
   ```
4. Khởi động server Next.js dev:
   ```bash
   npm run dev
   ```
   *Lưu ý: Frontend sẽ chạy tại: `http://localhost:3000`*

---

## 🧪 Kiểm Thử Hệ Thống

### 1. Chạy Unit Tests (Backend)
Backend được trang bị bộ kiểm thử gồm 17 test cases bao quát API Đơn hàng, Webhook và Mock Payment:
```bash
cd backend
npm test
```

### 2. Chạy Luồng Kiểm Thử Tích Hợp E2E (Simulation)
Kịch bản giả lập tạo đơn hàng -> Thanh toán Mock -> Xác nhận DB:
```bash
cd backend
node scratch/test-flow.js
```

---

## 📂 Danh Sách Các File Quan Trọng

- **Frontend**:
  - `frontend/src/app/page.js`: Landing page giao diện chính & form đặt hàng.
  - `frontend/src/app/thank-you/page.js`: Trang cảm ơn hiển thị hóa đơn và hiệu ứng pháo hoa.
  - `frontend/src/app/globals.css`: Thiết lập theme Tailwind CSS v4 và fonts.
- **Backend**:
  - `backend/src/app.js`: Điểm khởi chạy Express Server, thiết lập routing và CORS.
  - `backend/src/controllers/orderController.js`: Xử lý tạo đơn hàng, Stripe webhook, mock payment.
  - `backend/src/services/stripe.js`: Tích hợp Stripe SDK và cơ chế Mock thanh toán dự phòng.
  - `backend/tests/order.test.js`: Bộ 17 Test cases cho Order API.
  - `backend/scratch/test-flow.js`: Script kiểm thử tự động toàn bộ luồng tích hợp.
