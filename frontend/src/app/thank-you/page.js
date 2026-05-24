'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Home, Sparkles, ShoppingBag, PhoneCall, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2D2D2D] items-center justify-center py-16 px-4">
        <div className="w-8 h-8 border-2 border-[#7D8C77] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm mt-3 text-gray-500">Đang tải trang cảm ơn...</span>
      </div>
    }>
      <ThankYouPageContent />
    </Suspense>
  );
}

function ThankYouPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trực tiếp bắn pháo hoa confetti khi load trang cảm ơn
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti bắn từ cả 2 góc màn hình
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Lỗi khi fetch thông tin đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const copyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVariantName = (variant) => {
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
      default: return variant;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2D2D2D] items-center justify-center py-16 px-4">
      {/* Decorative Zen Blob */}
      <div className="absolute w-96 h-96 rounded-full bg-[#7D8C77]/5 -top-12 -left-12 blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute w-96 h-96 rounded-full bg-[#E0A899]/5 -bottom-12 -right-12 blur-3xl z-0 pointer-events-none"></div>

      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl border border-[#7D8C77]/10 z-10 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7D8C77]/10 text-[#7D8C77] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#2D2D2D]">Thanh Toán Thành Công</h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Mộc Craft chân thành cảm ơn quý khách. Đơn hàng của bạn đã được ghi nhận và bắt đầu chuẩn bị thủ công.
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-sm text-gray-400">
            <div className="w-6 h-6 border-2 border-[#7D8C77] border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải thông tin đơn hàng...</span>
          </div>
        ) : order ? (
          <div className="border border-dashed border-[#7D8C77]/25 rounded-2xl p-6 text-left space-y-4 bg-[#FDFBF7]">
            <div className="flex justify-between items-center text-xs text-gray-400 pb-3 border-b border-gray-100">
              <span className="flex items-center">
                Mã đơn hàng:
                <span className="font-mono text-gray-600 font-bold ml-1">{order.id.slice(0, 8)}...</span>
                <button onClick={copyOrderId} className="ml-1 text-[#7D8C77] hover:text-[#687563] cursor-pointer">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </span>
              <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>

            <div className="space-y-2.5 text-sm">
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wider block">Người nhận hàng</span>
                <span className="font-semibold text-gray-800">{order.customerName} - {order.phoneNumber}</span>
              </div>

              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wider block">Địa chỉ giao hàng</span>
                <span className="text-gray-600">{order.deliveryAddress}</span>
              </div>

              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wider block">Sản phẩm đặt mua</span>
                <span className="text-gray-800 font-medium">{getVariantName(order.productVariant)}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-semibold text-base">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="text-[#E0A899] font-serif text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 text-xs">
                <span className="text-gray-500">Trạng thái thanh toán:</span>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-full border border-green-200 uppercase tracking-wide">
                  {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-sm text-amber-600 bg-amber-50 rounded-2xl border border-amber-100 p-4">
            Không tìm thấy thông tin đơn hàng cụ thể trên máy chủ, nhưng giao dịch của bạn đã hoàn tất trên hệ thống thanh toán.
          </div>
        )}

        <div className="bg-[#7D8C77]/5 rounded-2xl p-4 flex items-start space-x-3 text-left">
          <Sparkles className="w-5 h-5 text-[#7D8C77] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#7D8C77] uppercase tracking-wider">Thông điệp từ Mộc Craft</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Mỗi sản phẩm móc len của chúng tôi là sản phẩm làm tay khép kín. Người thợ sẽ đóng gói chỉnh chu trong hộp giấy Kraft, buộc dây thừng đính nhành hoa nhài khô. Nhân viên chăm sóc khách hàng của chúng tôi sẽ nhắn tin xác nhận đơn hàng của bạn qua Zalo/SMS trong vòng 24 giờ tới.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-semibold transition-all cursor-pointer bg-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
          <a
            href="https://zalo.me/0908123456"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-xl bg-[#7D8C77] hover:bg-[#687563] text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            Hỗ trợ Zalo
          </a>
        </div>
      </div>
    </div>
  );
}
