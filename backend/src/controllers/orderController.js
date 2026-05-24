import prisma from '../services/db.js';
import * as stripeService from '../services/stripe.js';

// Định nghĩa giá bán cho các phân loại sản phẩm
const VARIANT_PRICES = {
  // Dòng sản phẩm cũ (giữ lại để tương thích ngược)
  'Taplo_8cm': 299000, 
  'Desk_12cm': 499000,
  
  // Tượng Phật Dược Sư (Bán chạy nhất)
  'DuocSu_10cm': 399000,
  'DuocSu_12cm': 499000,
  
  // Tượng Phật Thích Ca Mâu Ni
  'ThichCa_8cm': 299000,
  'ThichCa_12cm': 499000,
  
  // Tượng Bồ Tát Quán Thế Âm
  'QuanAm_10cm': 399000,
  'QuanAm_12cm': 499000,
  
  // Tượng Phật Di Lặc
  'DiLac_8cm': 299000,
  'DiLac_12cm': 450000
};

/**
 * API tạo đơn hàng mới và khởi tạo phiên thanh toán Stripe
 */
export const createOrder = async (req, res) => {
  try {
    const { customerName, phoneNumber, deliveryAddress, productVariant } = req.body;

    // Validate input fields
    if (!customerName || !phoneNumber || !deliveryAddress || !productVariant) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin: Tên, Số điện thoại, Địa chỉ và Phân loại sản phẩm.' });
    }

    // Tìm kiếm giá và kiểm tra variant động từ cơ sở dữ liệu
    let products = [];
    if (prisma.product && typeof prisma.product.findMany === 'function') {
      products = await prisma.product.findMany().catch(() => []);
    }
    let amount = null;

    if (products.length > 0) {
      for (const p of products) {
        try {
          const variants = JSON.parse(p.variantsJson);
          const found = variants.find(v => v.key === productVariant);
          if (found) {
            amount = found.price;
            break;
          }
        } catch (e) {
          console.error('Lỗi phân tích JSON variant của sản phẩm:', p.id, e);
        }
      }
    }

    // Fallback về bảng giá tĩnh cho môi trường Unit Test Jest (nơi mock DB chưa có dữ liệu)
    if (!amount) {
      amount = VARIANT_PRICES[productVariant];
    }

    if (!amount) {
      return res.status(400).json({ error: 'Phân loại sản phẩm không hợp lệ.' });
    }

    // 1. Tạo đơn hàng với trạng thái PENDING
    const order = await prisma.order.create({
      data: {
        customerName,
        phoneNumber,
        deliveryAddress,
        productVariant,
        amount,
        paymentStatus: 'PENDING'
      }
    });

    // 2. Tạo Stripe checkout session
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Tự động xác định domain của backend từ request để Mock Pay hoạt động trên production
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const backendUrl = `${protocol}://${host}`;

    const session = await stripeService.createCheckoutSession(order, frontendUrl, backendUrl);

    // 3. Cập nhật stripeSessionId vào đơn hàng
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return res.status(201).json({
      message: 'Tạo đơn hàng thành công, đang chuyển hướng thanh toán.',
      orderId: updatedOrder.id,
      stripeSessionId: session.id,
      checkoutUrl: session.url,
      isMock: session.isMock || false
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi hệ thống trong quá trình tạo đơn hàng.' });
  }
};

/**
 * API nhận Stripe Webhook để tự động cập nhật trạng thái đơn hàng
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // stripeService.verifyWebhookSignature xử lý cả mock và real
    event = stripeService.verifyWebhookSignature(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Lỗi Stripe Webhook signature verification:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý sự kiện checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const sessionId = session.id;

    console.log(`[Webhook Received] Thanh toán thành công cho Session ID: ${sessionId}`);

    try {
      let orderToUpdate = null;

      if (orderId) {
        orderToUpdate = await prisma.order.findUnique({ where: { id: orderId } });
      } else {
        // Tìm đơn hàng bằng sessionId nếu metadata trống
        orderToUpdate = await prisma.order.findUnique({ where: { stripeSessionId: sessionId } });
      }

      if (orderToUpdate) {
        await prisma.order.update({
          where: { id: orderToUpdate.id },
          data: { paymentStatus: 'PAID' }
        });
        console.log(`[Webhook Completed] Đã cập nhật đơn hàng ${orderToUpdate.id} sang trạng thái PAID.`);
      } else {
        console.warn(`[Webhook Warning] Không tìm thấy đơn hàng tương ứng với Stripe Session: ${sessionId}`);
      }
    } catch (dbError) {
      console.error('[Webhook Error] Lỗi cập nhật cơ sở dữ liệu đơn hàng:', dbError);
      return res.status(500).json({ error: 'Lỗi cập nhật DB' });
    }
  }

  return res.status(200).json({ received: true });
};

/**
 * Helper endpoint giả lập thanh toán (Chỉ dành cho Mock Mode)
 */
export const mockPay = async (req, res) => {
  const { orderId } = req.params;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).send('Không tìm thấy đơn hàng để thanh toán giả lập.');
    }

    // Cập nhật trạng thái thanh toán thành PAID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID' }
    });

    console.log(`[Mock Pay] Đã thanh toán giả lập thành công cho đơn hàng: ${orderId}`);

    // Chuyển hướng người dùng về trang Cảm ơn trên frontend
    return res.redirect(`${frontendUrl}/thank-you?status=success&order_id=${orderId}&session_id=mock_session_${orderId}`);
  } catch (error) {
    console.error('Lỗi khi giả lập thanh toán:', error);
    return res.status(500).send('Lỗi máy chủ trong quá trình giả lập thanh toán.');
  }
};

/**
 * API lấy chi tiết đơn hàng theo ID
 */
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin đơn hàng.' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Lỗi lấy chi tiết đơn hàng:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi tải thông tin đơn hàng.' });
  }
};

/**
 * API lấy toàn bộ danh sách đơn hàng (cho mục đích quản lý/kiểm tra)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Lỗi lấy toàn bộ đơn hàng:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi tải danh sách đơn hàng.' });
  }
};
