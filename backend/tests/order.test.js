import { jest } from '@jest/globals';
import request from 'supertest';

// 1. Mock the services using Jest's unstable_mockModule for ES Modules
jest.unstable_mockModule('../src/services/db.js', () => {
  return {
    default: {
      order: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    },
  };
});

jest.unstable_mockModule('../src/services/stripe.js', () => {
  return {
    createCheckoutSession: jest.fn(),
    verifyWebhookSignature: jest.fn(),
    getMockStatus: jest.fn(),
  };
});

// 2. Import modules dynamically after defining the mocks
const { default: app } = await import('../src/app.js');
const { default: prisma } = await import('../src/services/db.js');
const stripeService = await import('../src/services/stripe.js');

describe('Order API Unit/Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders (Create Order)', () => {
    it('should successfully create an order, initiate Stripe checkout session, and return 201', async () => {
      const orderData = {
        customerName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        deliveryAddress: '123 Lê Lợi, Quận 1, TP. HCM',
        productVariant: 'Taplo_8cm',
      };

      const createdOrder = {
        id: 'order-123-uuid',
        ...orderData,
        amount: 299000,
        paymentStatus: 'PENDING',
        stripeSessionId: null,
        createdAt: new Date(),
      };

      const mockSession = {
        id: 'session-stripe-123',
        url: 'https://checkout.stripe.com/pay/session-stripe-123',
        isMock: false,
      };

      const updatedOrder = {
        ...createdOrder,
        stripeSessionId: 'session-stripe-123',
      };

      // Mock database and Stripe behaviors
      prisma.order.create.mockResolvedValue(createdOrder);
      stripeService.createCheckoutSession.mockResolvedValue(mockSession);
      prisma.order.update.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Tạo đơn hàng thành công, đang chuyển hướng thanh toán.',
        orderId: 'order-123-uuid',
        stripeSessionId: 'session-stripe-123',
        checkoutUrl: 'https://checkout.stripe.com/pay/session-stripe-123',
        isMock: false,
      });

      // Verify Prisma create was called correctly
      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          customerName: orderData.customerName,
          phoneNumber: orderData.phoneNumber,
          deliveryAddress: orderData.deliveryAddress,
          productVariant: orderData.productVariant,
          amount: 299000,
          paymentStatus: 'PENDING',
        },
      });

      // Verify Stripe session helper was called
      expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
        createdOrder,
        expect.any(String),
        expect.any(String)
      );

      // Verify Prisma update was called to save session ID
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-123-uuid' },
        data: { stripeSessionId: 'session-stripe-123' },
      });
    });

    it('should return 400 when missing required input fields', async () => {
      const incompleteData = {
        customerName: 'Nguyễn Văn A',
        // phoneNumber is missing
        deliveryAddress: '123 Lê Lợi, Quận 1, TP. HCM',
        productVariant: 'Taplo_8cm',
      };

      const response = await request(app)
        .post('/api/orders')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Vui lòng cung cấp đầy đủ thông tin: Tên, Số điện thoại, Địa chỉ và Phân loại sản phẩm.',
      });

      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it('should return 400 when product variant is invalid', async () => {
      const invalidVariantData = {
        customerName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        deliveryAddress: '123 Lê Lợi, Quận 1, TP. HCM',
        productVariant: 'Invalid_Variant_Type',
      };

      const response = await request(app)
        .post('/api/orders')
        .send(invalidVariantData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Phân loại sản phẩm không hợp lệ.',
      });

      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it('should return 500 when database fails during order creation', async () => {
      const orderData = {
        customerName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        deliveryAddress: '123 Lê Lợi, Quận 1, TP. HCM',
        productVariant: 'Taplo_8cm',
      };

      prisma.order.create.mockRejectedValue(new Error('Prisma Create Error'));

      const response = await request(app)
        .post('/api/orders')
        .send(orderData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Đã xảy ra lỗi hệ thống trong quá trình tạo đơn hàng.',
      });
    });
  });

  describe('GET /api/orders/:id (Get Order by ID)', () => {
    it('should return the order details when order exists', async () => {
      const mockOrder = {
        id: 'order-123-uuid',
        customerName: 'Nguyễn Văn A',
        phoneNumber: '0912345678',
        deliveryAddress: '123 Lê Lợi, Quận 1, TP. HCM',
        productVariant: 'Taplo_8cm',
        amount: 299000,
        paymentStatus: 'PAID',
        stripeSessionId: 'session-stripe-123',
        createdAt: '2026-05-21T09:00:00.000Z',
      };

      prisma.order.findUnique.mockResolvedValue(mockOrder);

      const response = await request(app).get('/api/orders/order-123-uuid');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrder);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-123-uuid' },
      });
    });

    it('should return 404 when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/orders/non-existent-uuid');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Không tìm thấy thông tin đơn hàng.',
      });
    });

    it('should return 500 when database fails during query', async () => {
      prisma.order.findUnique.mockRejectedValue(new Error('Prisma Query Error'));

      const response = await request(app).get('/api/orders/order-123-uuid');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Lỗi hệ thống khi tải thông tin đơn hàng.',
      });
    });
  });

  describe('GET /api/orders (Get All Orders)', () => {
    it('should return all orders ordered by creation date desc', async () => {
      const mockOrders = [
        { id: 'order-2', customerName: 'Customer 2', createdAt: '2026-05-21T10:00:00.000Z' },
        { id: 'order-1', customerName: 'Customer 1', createdAt: '2026-05-21T09:00:00.000Z' },
      ];

      prisma.order.findMany.mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return 500 when database fails to list orders', async () => {
      prisma.order.findMany.mockRejectedValue(new Error('Prisma Query Error'));

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Lỗi hệ thống khi tải danh sách đơn hàng.',
      });
    });
  });

  describe('POST /api/webhook/payment (Stripe Webhook)', () => {
    it('should process checkout.session.completed event and update order to PAID (using orderId in metadata)', async () => {
      const webhookPayload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'session-stripe-123',
            metadata: {
              orderId: 'order-123-uuid',
            },
          },
        },
      };

      const mockOrder = {
        id: 'order-123-uuid',
        paymentStatus: 'PENDING',
        stripeSessionId: 'session-stripe-123',
      };

      stripeService.verifyWebhookSignature.mockReturnValue(webhookPayload);
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.order.update.mockResolvedValue({ ...mockOrder, paymentStatus: 'PAID' });

      const response = await request(app)
        .post('/api/webhook/payment')
        .set('stripe-signature', 'valid_signature')
        .send(webhookPayload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });

      expect(stripeService.verifyWebhookSignature).toHaveBeenCalled();
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-123-uuid' },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-123-uuid' },
        data: { paymentStatus: 'PAID' },
      });
    });

    it('should update order to PAID using stripeSessionId fallback if metadata has no orderId', async () => {
      const webhookPayload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'session-stripe-123',
            // No metadata
          },
        },
      };

      const mockOrder = {
        id: 'order-123-uuid',
        paymentStatus: 'PENDING',
        stripeSessionId: 'session-stripe-123',
      };

      stripeService.verifyWebhookSignature.mockReturnValue(webhookPayload);
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.order.update.mockResolvedValue({ ...mockOrder, paymentStatus: 'PAID' });

      const response = await request(app)
        .post('/api/webhook/payment')
        .set('stripe-signature', 'valid_signature')
        .send(webhookPayload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { stripeSessionId: 'session-stripe-123' },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-123-uuid' },
        data: { paymentStatus: 'PAID' },
      });
    });

    it('should return 400 if Stripe Webhook signature verification fails', async () => {
      stripeService.verifyWebhookSignature.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const response = await request(app)
        .post('/api/webhook/payment')
        .set('stripe-signature', 'invalid_signature')
        .send({ some: 'data' });

      expect(response.status).toBe(400);
      expect(response.text).toContain('Webhook Error: Invalid signature');
    });

    it('should not update anything and return 200 if order is not found', async () => {
      const webhookPayload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'session-stripe-notFound',
            metadata: {
              orderId: 'order-notfound-uuid',
            },
          },
        },
      };

      stripeService.verifyWebhookSignature.mockReturnValue(webhookPayload);
      prisma.order.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/webhook/payment')
        .set('stripe-signature', 'valid_signature')
        .send(webhookPayload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
      expect(prisma.order.update).not.toHaveBeenCalled();
    });

    it('should return 500 when database update fails during webhook processing', async () => {
      const webhookPayload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'session-stripe-123',
            metadata: {
              orderId: 'order-123-uuid',
            },
          },
        },
      };

      const mockOrder = {
        id: 'order-123-uuid',
        paymentStatus: 'PENDING',
      };

      stripeService.verifyWebhookSignature.mockReturnValue(webhookPayload);
      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.order.update.mockRejectedValue(new Error('Prisma Update Error'));

      const response = await request(app)
        .post('/api/webhook/payment')
        .set('stripe-signature', 'valid_signature')
        .send(webhookPayload);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Lỗi cập nhật DB' });
    });
  });

  describe('GET /api/orders/mock-pay/:orderId (Mock payment logic)', () => {
    it('should successfully update order status and redirect to frontend thank-you page', async () => {
      const mockOrder = {
        id: 'order-123-uuid',
        paymentStatus: 'PENDING',
      };

      prisma.order.findUnique.mockResolvedValue(mockOrder);
      prisma.order.update.mockResolvedValue({ ...mockOrder, paymentStatus: 'PAID' });

      const response = await request(app).get('/api/orders/mock-pay/order-123-uuid');

      expect(response.status).toBe(302);
      expect(response.headers.location).toContain('thank-you?status=success&order_id=order-123-uuid');
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-123-uuid' },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-123-uuid' },
        data: { paymentStatus: 'PAID' },
      });
    });

    it('should return 404 when order is not found for mock payment', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/orders/mock-pay/non-existent-uuid');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Không tìm thấy đơn hàng để thanh toán giả lập.');
    });

    it('should return 500 when database fails during mock payment', async () => {
      prisma.order.findUnique.mockRejectedValue(new Error('Prisma Query Error'));

      const response = await request(app).get('/api/orders/mock-pay/order-123-uuid');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Lỗi máy chủ trong quá trình giả lập thanh toán.');
    });
  });
});
