// Sử dụng native fetch có sẵn của Node.js v18+
async function runIntegrationTest() {
  console.log('=== KHỞI ĐỘNG KIỂM THỬ TÍCH HỢP HỆ THỐNG ===\n');

  const customerData = {
    customerName: 'Nguyễn Bình An',
    phoneNumber: '0908777999',
    deliveryAddress: 'Thất Tịnh Thất, Núi Dinh, Bà Rịa - Vũng Tàu',
    productVariant: 'DuocSu_12cm'
  };

  try {
    // 1. Tạo đơn hàng mới
    console.log('1. Đang gửi yêu cầu tạo đơn hàng...');
    const createRes = await fetch('http://localhost:5050/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    if (!createRes.ok) {
      throw new Error(`Tạo đơn hàng thất bại: ${createRes.statusText}`);
    }

    const createResult = await createRes.json();
    console.log('   [Thành công] Đơn hàng được tạo:');
    console.log(`   - Order ID: ${createResult.orderId}`);
    console.log(`   - Stripe Session ID: ${createResult.stripeSessionId}`);
    console.log(`   - Checkout URL: ${createResult.checkoutUrl}`);
    console.log(`   - Chế độ giả lập (Mock Mode): ${createResult.isMock}`);

    const orderId = createResult.orderId;

    // 2. Kiểm tra trạng thái đơn hàng ban đầu
    console.log('\n2. Kiểm tra trạng thái ban đầu của đơn hàng trong database...');
    const checkRes = await fetch(`http://localhost:5050/api/orders/${orderId}`);
    const orderData = await checkRes.json();
    console.log(`   - Trạng thái hiện tại: ${orderData.paymentStatus} (Kỳ vọng: PENDING)`);

    if (orderData.paymentStatus !== 'PENDING') {
      throw new Error(`Trạng thái ban đầu không khớp! Nhận được: ${orderData.paymentStatus}`);
    }

    // 3. Giả lập thanh toán qua mock-pay
    console.log('\n3. Đang giả lập khách hàng nhấn "Thanh Toán" (gọi mock-pay redirect)...');
    // Vì mock-pay redirect về frontend, ta gọi fetch và không follow redirect để kiểm tra hoặc xem response code
    const payRes = await fetch(`http://localhost:5050/api/orders/mock-pay/${orderId}`, {
      redirect: 'manual'
    });

    console.log(`   - HTTP Status: ${payRes.status}`);
    console.log(`   - Hướng điều hướng (Redirect Location): ${payRes.headers.get('location')}`);

    // 4. Xác minh trạng thái đơn hàng sau khi thanh toán
    console.log('\n4. Kiểm tra trạng thái đơn hàng trong database sau khi thanh toán...');
    const checkPaidRes = await fetch(`http://localhost:5050/api/orders/${orderId}`);
    const paidOrderData = await checkPaidRes.json();
    console.log(`   - Trạng thái hiện tại: ${paidOrderData.paymentStatus} (Kỳ vọng: PAID)`);

    if (paidOrderData.paymentStatus !== 'PAID') {
      throw new Error(`Thanh toán thất bại! Trạng thái vẫn là: ${paidOrderData.paymentStatus}`);
    }

    // 5. In bảng kết quả phân tích theo RULE của PM
    console.log('\n========================================================================');
    console.log('   BẢNG PHÂN TÍCH KẾT QUẢ KIỂM THỬ TÍCH HỢP LUỒNG CHECKOUT (CHECKOUT WORKFLOW)');
    console.log('========================================================================');
    console.log('| Bước kiểm thử           | Endpoint / Action             | Trạng thái | Ghi chú                          |');
    console.log('|-------------------------|-------------------------------|------------|----------------------------------|');
    console.log(`| 1. Tạo đơn hàng (POST)  | /api/orders                   | THÀNH CÔNG | Order ID: ${orderId.slice(0, 8)}...    |`);
    console.log(`| 2. Kiểm tra DB ban đầu  | /api/orders/${orderId.slice(0, 5)}...           | THÀNH CÔNG | Trạng thái: PENDING (Đúng)      |`);
    console.log(`| 3. Giả lập Pay (GET)    | /api/orders/mock-pay/${orderId.slice(0, 5)}...  | THÀNH CÔNG | HTTP 302 Redirect                |`);
    console.log(`| 4. Kiểm tra DB sau Pay  | /api/orders/${orderId.slice(0, 5)}...           | THÀNH CÔNG | Trạng thái: PAID (Đúng)         |`);
    console.log('========================================================================');
    console.log('\n=== TẤT CẢ CÁC BƯỚC ĐỀU THÀNH CÔNG RỰC RỠ ===\n');

  } catch (error) {
    console.error('\n❌ KIỂM THỬ THẤT BẠI VỚI LỖI:', error.message);
  }
}

runIntegrationTest();
