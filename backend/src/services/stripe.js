import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
const isMockMode = !stripeSecretKey || stripeSecretKey.includes('Mocked') || stripeSecretKey === 'sk_test_...';

let stripeClient = null;
if (!isMockMode) {
  stripeClient = new Stripe(stripeSecretKey);
}

const getVariantDescription = (variant) => {
  switch (variant) {
    case 'DuocSu_10cm': return 'Tượng Phật Dược Sư (Size 10cm - Cầu sức khỏe, bình an)';
    case 'DuocSu_12cm': return 'Tượng Phật Dược Sư (Size 12cm - Cầu sức khỏe, bình an)';
    case 'ThichCa_8cm': return 'Tượng Phật Thích Ca (Size 8cm - Khai sáng & Tĩnh lặng)';
    case 'ThichCa_12cm': return 'Tượng Phật Thích Ca (Size 12cm - Khai sáng & Tĩnh lặng)';
    case 'QuanAm_10cm': return 'Tượng Bồ Tát Quán Thế Âm (Size 10cm - Từ bi & Che chở)';
    case 'QuanAm_12cm': return 'Tượng Bồ Tát Quán Thế Âm (Size 12cm - Từ bi & Che chở)';
    case 'DiLac_8cm': return 'Tượng Phật Di Lặc (Size 8cm - Hoan hỷ & Tài lộc)';
    case 'DiLac_12cm': return 'Tượng Phật Di Lặc (Size 12cm - Hoan hỷ & Tài lộc)';
    case 'Taplo_8cm': return 'Tượng 8cm Taplo xe hơi/Bàn làm việc';
    case 'Desk_12cm': return 'Tượng 12cm Trang trí phòng khách';
    default: return `Phân loại: ${variant}`;
  }
};

/**
 * Tạo Stripe Checkout Session hoặc Mock Checkout Session URL
 * @param {Object} order - Đơn hàng vừa tạo
 * @param {string} frontendUrl - URL của Frontend để quay lại sau khi thanh toán
 */
export const createCheckoutSession = async (order, frontendUrl) => {
  if (isMockMode) {
    console.log(`[Stripe Mock Mode] Tạo mock checkout session cho Order ID: ${order.id}`);
    // Trả về mock URL dẫn đến endpoint giả lập thanh toán của backend
    return {
      id: `mock_session_${order.id}`,
      url: `http://localhost:${process.env.PORT || 5050}/api/orders/mock-pay/${order.id}`,
      isMock: true
    };
  }

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: {
              name: `Tượng Phật Móc Len Mộc Craft`,
              description: `Sản phẩm: ${getVariantDescription(order.productVariant)}`,
            },
            unit_amount: order.amount, // VND không cần chia 100
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/?status=canceled`,
      metadata: {
        orderId: order.id,
      },
    });

    return {
      id: session.id,
      url: session.url,
      isMock: false
    };
  } catch (error) {
    console.error('Lỗi khi tạo Stripe Session thật:', error.message);
    throw error;
  }
};

/**
 * Xác thực và phân tích Stripe Webhook event
 * @param {Buffer} rawBody - Raw body của request
 * @param {string} signature - Chữ ký Stripe
 * @param {string} webhookSecret - Secret key của webhook
 */
export const verifyWebhookSignature = (rawBody, signature, webhookSecret) => {
  if (isMockMode) {
    console.log('[Stripe Mock Mode] Đang bỏ qua xác thực webhook signature.');
    // Trả về một event mock để dễ dàng test
    try {
      const parsedBody = JSON.parse(rawBody.toString());
      return parsedBody;
    } catch {
      return {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'mock_session_id',
            metadata: {
              orderId: 'mock-order-id'
            }
          }
        }
      };
    }
  }

  return stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
};

export const getMockStatus = () => isMockMode;
