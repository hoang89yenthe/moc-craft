'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Check, Sparkles, Star, Loader2, X, ArrowRight,
  Maximize2, Scissors, PenTool, ClipboardCheck, PhoneCall, HelpCircle
} from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deliveryAddress: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          // Set default variant
          try {
            const variants = JSON.parse(data.variantsJson);
            if (variants.length > 0) {
              setSelectedVariant(variants[0].key);
            }
          } catch (e) {
            console.error('Error parsing variants', e);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setErrorMessage('');

    if (!formData.customerName || !formData.phoneNumber || !formData.deliveryAddress) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường thông tin.');
      setCheckoutLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productVariant: selectedVariant
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi tạo đơn hàng.');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Không nhận được liên kết thanh toán từ máy chủ.');
      }
    } catch (err) {
      console.error('Lỗi khi checkout:', err);
      setErrorMessage(err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-3 text-sm text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#7D8C77]" />
        <span>Đang tải thông tin chi tiết tác phẩm...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-gray-500">Không tìm thấy tác phẩm này trên hệ thống.</p>
        <Link href="/" className="px-4 py-2 bg-[#7D8C77] text-white rounded-xl text-sm font-semibold">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const variantsList = JSON.parse(product.variantsJson || '[]');
  const activeVariantObj = variantsList.find(v => v.key === selectedVariant) || (variantsList.length > 0 ? variantsList[0] : null);

  // Split features
  const featuresList = product.features ? product.features.split(';').map(f => f.trim()).filter(f => f) : [];
  const materialsList = product.materials ? product.materials.split(',').map(m => m.trim()).filter(m => m) : [];

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#2D2D2D] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-[#FDFBF7] rounded-[40px] shadow-xl border border-[#7D8C77]/10 p-6 sm:p-12 relative overflow-hidden">
        
        {/* Zen Background Blobs */}
        <div className="absolute w-80 h-80 rounded-full bg-[#E0A899]/5 -top-20 -right-20 blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute w-80 h-80 rounded-full bg-[#7D8C77]/5 -bottom-20 -left-20 blur-3xl z-0 pointer-events-none"></div>

        {/* Back Link */}
        <div className="relative z-10 mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-[#7D8C77] hover:underline font-medium">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Bộ sưu tập Mộc Craft
          </Link>
        </div>

        {/* Calligraphy Title for Desktop (Absolute center top option) */}
        <div className="text-center md:hidden mb-6">
          <span className="font-serif italic text-lg text-[#7D8C77] block mb-1">Tác phẩm chánh niệm</span>
          <h1 className="font-serif text-3xl font-extrabold tracking-wide text-[#8C6D4F] uppercase">
            {product.name}
          </h1>
          <div className="w-12 h-0.5 bg-[#E0A899] mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start relative z-10">
          
          {/* LEFT SIDE DETAILS PANEL (Exactly matches the card groups in the image) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* 1. Dimensions card */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#7D8C77]/10 flex items-start space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#7D8C77]/10 flex items-center justify-center text-[#7D8C77] shrink-0">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-[#7D8C77] uppercase tracking-wider">Kích thước tượng:</h3>
                <p className="text-xs text-gray-600">Chiều cao: <span className="font-semibold">{product.height}</span></p>
                <p className="text-xs text-gray-600">Chiều ngang: <span className="font-semibold">{product.width}</span></p>
              </div>
            </div>

            {/* 2. Materials card */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#7D8C77]/10 flex items-start space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#7D8C77]/10 flex items-center justify-center text-[#7D8C77] shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-sm text-[#7D8C77] uppercase tracking-wider">Nguyên liệu:</h3>
                <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                  {materialsList.map((mat, idx) => (
                    <li key={idx}>{mat}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Crochet hook card */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#7D8C77]/10 flex items-start space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#7D8C77]/10 flex items-center justify-center text-[#7D8C77] shrink-0">
                <PenTool className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-[#7D8C77] uppercase tracking-wider">Kim móc:</h3>
                <p className="text-xs text-gray-600">{product.crochetHook}</p>
              </div>
            </div>

            {/* 4. Product features card */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#7D8C77]/10 flex items-start space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#7D8C77]/10 flex items-center justify-center text-[#7D8C77] shrink-0">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 w-full">
                <h3 className="font-serif font-bold text-sm text-[#7D8C77] uppercase tracking-wider">Đặc điểm sản phẩm</h3>
                <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                  {featuresList.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Artisan tag */}
            <div className="text-center py-4 border-t border-[#7D8C77]/10">
              <div className="inline-flex items-center space-x-2 text-xs text-[#8C6D4F] font-serif font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0A899]"></span>
                <span>Sản phẩm được làm hoàn toàn thủ công bởi:</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0A899]"></span>
              </div>
              <span className="block font-serif text-lg font-bold text-[#7D8C77] mt-1.5 tracking-wide italic">
                {product.createdBy || 'Hằng Phạm - Mộc Craft'}
              </span>
            </div>

          </div>

          {/* RIGHT SIDE LARGE DISPLAY (Image + Large calligraphy header) */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-left space-y-6">
            
            {/* Calligraphy Header (Amitabha style layout) */}
            <div className="hidden md:block">
              <span className="font-serif italic text-lg text-[#7D8C77] block mb-1">Tác phẩm chánh niệm</span>
              <h1 className="font-serif text-5xl font-extrabold tracking-wide text-[#8C6D4F] uppercase leading-tight">
                {product.name}
              </h1>
              <div className="w-16 h-0.5 bg-[#E0A899] mt-3 rounded-full"></div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-lg text-center md:text-left">
              {product.desc}
            </p>

            {/* Main Visual Frame */}
            <div className="w-full max-w-md aspect-square rounded-[30px] overflow-hidden border-4 border-white shadow-xl bg-gray-50 relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {product.bestSeller && (
                <span className="absolute top-4 right-4 bg-[#E0A899] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full animate-pulse shadow-md">
                  Bán Chạy Nhất
                </span>
              )}
            </div>

            {/* Active Variant Price & Checkout Call to Action */}
            <div className="w-full max-w-md bg-[#FAF7F0] p-6 rounded-2xl border border-[#7D8C77]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Mức giá khuyến nghị:</span>
                <span className="font-serif text-3xl font-bold text-[#E0A899] block mt-1">
                  {activeVariantObj ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activeVariantObj.price) : '0đ'}
                </span>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-4 bg-[#7D8C77] hover:bg-[#687563] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                Sở Hữu Ngay <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* BOTTOM DETAIL GALLERY SECTION ("CHI TIẾT SẢN PHẨM" exactly like image footer) */}
        <div className="mt-16 pt-12 border-t border-[#7D8C77]/10 relative">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-[#7D8C77] uppercase tracking-widest">Góc Cận Cảnh</span>
            <h2 className="font-serif text-2xl font-bold text-gray-800">Chi Tiết Sản Phẩm</h2>
            <div className="w-10 h-0.5 bg-[#E0A899] mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Gallery item 1: Face */}
            <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-3">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-150 relative">
                <img src={product.image} className="w-full h-full object-cover scale-[1.3] translate-y-[-5%]" alt="Diện mạo" />
              </div>
              <span className="text-xs text-gray-600 font-medium leading-relaxed">
                {product.detailFace}
              </span>
            </div>

            {/* Gallery item 2: Robe */}
            <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-3">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-150 relative">
                <img src={product.image} className="w-full h-full object-cover scale-[1.6] translate-y-[20%]" alt="Y phục" />
              </div>
              <span className="text-xs text-gray-600 font-medium leading-relaxed">
                {product.detailRobe}
              </span>
            </div>

            {/* Gallery item 3: Hand */}
            <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-3">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-150 relative">
                <img src={product.image} className="w-full h-full object-cover scale-[1.8] translate-x-[-10%] translate-y-[10%]" alt="Tay cầm" />
              </div>
              <span className="text-xs text-gray-600 font-medium leading-relaxed">
                {product.detailHand}
              </span>
            </div>

            {/* Gallery item 4: Quality */}
            <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center space-y-3">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-150 relative">
                <img src={product.image} className="w-full h-full object-cover scale-[1.3] translate-y-[25%]" alt="Móc xích" />
              </div>
              <span className="text-xs text-gray-600 font-medium leading-relaxed">
                {product.detailQuality}
              </span>
            </div>

          </div>
        </div>

        {/* BOTTOM SOCIAL CONTACT BAR (Directly matching the contact footers in the image) */}
        <div className="mt-12 pt-6 border-t border-[#7D8C77]/10 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs text-gray-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-4 bg-black rounded-full flex items-center justify-center text-white text-[8px] font-bold">d</span>
            <span>Tiktok: <strong className="text-gray-700">Hằng Mê Len 🌻 1989</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 bg-[#3B5998] rounded-full flex items-center justify-center text-white text-[10px] font-bold">f</div>
            <span>Facebook: <strong className="text-gray-700">Hằng Phạm</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 bg-[#3B5998] rounded-full flex items-center justify-center text-white text-[10px] font-bold">f</div>
            <span>Fanpage: <strong className="text-gray-700">Mộc Craft</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 bg-[#1E88E5] rounded-full flex items-center justify-center text-white text-[8px] font-bold">Z</div>
            <span>Zalo: <strong className="text-[#1E88E5]">0989.837.663</strong></span>
          </div>
        </div>

      </div>

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FDFBF7]">
              <div>
                <h3 className="font-serif text-xl font-bold">Thông Tin Đặt Hàng</h3>
                <p className="text-xs text-gray-500 mt-1">Bạn đang tiến hành mua {product.name}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                  {errorMessage}
                </div>
              )}

              {/* Size Select */}
              {variantsList.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Chọn phân loại kích thước</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {variantsList.map((v) => (
                      <div
                        key={v.key}
                        onClick={() => setSelectedVariant(v.key)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedVariant === v.key
                            ? 'border-[#7D8C77] bg-[#7D8C77]/5'
                            : 'border-gray-200 hover:border-[#7D8C77]/50'
                        }`}
                      >
                        <span className="block font-semibold text-sm">{v.size}</span>
                        <span className="text-[10px] text-gray-400 block mt-1 leading-relaxed">{v.usage}</span>
                        <span className="block font-serif font-bold text-sm text-[#E0A899] mt-2">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Info Form */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Thông Tin Người Nhận</label>
                
                <div>
                  <label htmlFor="customerName" className="block text-xs font-medium text-gray-600 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Ví dụ: Nguyễn An Nhiên"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7D8C77] transition-all bg-gray-50"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-600 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Ví dụ: 0908123456"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7D8C77] transition-all bg-gray-50"
                  />
                </div>

                <div>
                  <label htmlFor="deliveryAddress" className="block text-xs font-medium text-gray-600 mb-1">Địa chỉ nhận hàng *</label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    rows="3"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required
                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7D8C77] transition-all bg-gray-50 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-semibold">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="text-[#E0A899] text-xl font-serif">
                  {activeVariantObj ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activeVariantObj.price) : '0đ'}
                </span>
              </div>

              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full py-4 rounded-2xl bg-[#7D8C77] hover:bg-[#687563] text-white font-semibold transition-all shadow-md flex justify-center items-center cursor-pointer disabled:opacity-75"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Đang kết nối cổng thanh toán...
                  </>
                ) : (
                  <>
                    Đặt Mua & Thanh Toán
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
