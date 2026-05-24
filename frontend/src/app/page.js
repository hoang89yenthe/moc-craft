'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Compass, Check, ArrowRight, Sparkles, Star, ShieldCheck, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';

const FALLBACK_PRODUCTS = [
  {
    id: 'duoc-su',
    name: 'Tượng Phật Dược Sư',
    desc: 'Tượng Phật Dược Sư (Bhaisajyaguru) tượng trưng cho sự chữa lành, cầu sức khỏe dồi dào, hóa giải tật ách và mang lại cát tường cho gia quyến.',
    bestSeller: true,
    variantsJson: JSON.stringify([
      { key: 'DuocSu_10cm', size: 'Size 10cm (Bàn làm việc)', price: 399000, priceText: '399.000đ', originalPriceText: '480.000đ', usage: 'Đặt bàn học, bàn làm việc, phòng thiền trà' },
      { key: 'DuocSu_12cm', size: 'Size 12cm (Kệ trang trí)', price: 499000, priceText: '499.000đ', originalPriceText: '590.000đ', usage: 'Đặt kệ sách, phòng khách, tủ trưng bày' }
    ]),
    image: '/buddha_crochet.png'
  },
  {
    id: 'thich-ca',
    name: 'Tượng Phật Thích Ca Mâu Ni',
    desc: 'Đức Thích Ca ngồi thiền định thư thái trên tòa sen, mang đến sự tập trung cao độ, khai sáng trí tuệ và sự tĩnh lặng tối đa cho không gian sống.',
    bestSeller: false,
    variantsJson: JSON.stringify([
      { key: 'ThichCa_8cm', size: 'Size 8cm (Taplo xe hơi)', price: 299000, priceText: '299.000đ', originalPriceText: '350.000đ', usage: 'Tặng kèm miếng dán taplo chống trượt' },
      { key: 'ThichCa_12cm', size: 'Size 12cm (Kệ trang trí)', price: 499000, priceText: '499.000đ', originalPriceText: '590.000đ', usage: 'Đế sen lót gỗ cao cấp' }
    ]),
    image: '/buddha_crochet.png'
  },
  {
    id: 'quan-am',
    name: 'Tượng Bồ Tát Quán Thế Âm',
    desc: 'Hiện thân của lòng đại từ đại bi, che chở và cứu khổ cứu nạn. Mang lại may mắn, bình an trên vạn dặm hành trình của bạn.',
    bestSeller: false,
    variantsJson: JSON.stringify([
      { key: 'QuanAm_10cm', size: 'Size 10cm (Góc làm việc)', price: 399000, priceText: '399.000đ', originalPriceText: '480.000đ', usage: 'Thích hợp đặt nơi yên tĩnh, làm quà tặng' },
      { key: 'QuanAm_12cm', size: 'Size 12cm (Không gian thiền)', price: 499000, priceText: '499.000đ', originalPriceText: '590.000đ', usage: 'Trang trí phòng khách, xe du lịch cỡ lớn' }
    ]),
    image: '/buddha_crochet.png'
  },
  {
    id: 'di-lac',
    name: 'Tượng Phật Di Lặc',
    desc: 'Vị Phật của niềm vui, sự hoan hỷ và phúc lộc viên mãn. Thần thái mỉm cười rạng rỡ xua tan mệt mỏi, thu hút may mắn tài lộc.',
    bestSeller: false,
    variantsJson: JSON.stringify([
      { key: 'DiLac_8cm', size: 'Size 8cm (Taplo xe hơi)', price: 299000, priceText: '299.000đ', originalPriceText: '350.000đ', usage: 'Đặt xe hơi mang lại tiếng cười suốt hành trình' },
      { key: 'DiLac_12cm', size: 'Size 12cm (Quầy thu ngân)', price: 450000, priceText: '450.000đ', originalPriceText: '550.000đ', usage: 'Đặt bàn làm việc, tủ kính, quầy thu ngân' }
    ]),
    image: '/buddha_crochet.png'
  }
];

export default function LandingPage() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState({});
  const scrollRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setProducts(data);
          }
        }
      } catch (error) {
        console.error('Lỗi khi fetch sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const bestSeller = products.find(p => p.bestSeller) || products[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2D2D2D] selection:bg-[#7D8C77] selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FDFBF7]/80 border-b border-[#7D8C77]/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#7D8C77] flex items-center justify-center text-white font-serif italic font-bold">
              M
            </div>
            <span className="font-serif text-xl font-semibold tracking-wide text-[#7D8C77]">Mộc Craft</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <a href="#danh-muc" className="hover:text-[#7D8C77] transition-colors">Tác Phẩm</a>
            <a href="#dac-diem" className="hover:text-[#7D8C77] transition-colors">Đặc Điểm</a>
            <a href="#cau-chuyen" className="hover:text-[#7D8C77] transition-colors">Câu Chuyện</a>
            <a href="#faq" className="hover:text-[#7D8C77] transition-colors">Hỏi Đáp</a>
            <Link href="/admin" className="text-xs px-2.5 py-1 rounded bg-[#E0A899]/15 text-[#E0A899] font-bold border border-[#E0A899]/20 hover:bg-[#E0A899]/30 transition-all">
              Admin Control
            </Link>
          </nav>

          <Link
            href={`/products/${bestSeller.id || 'duoc-su'}`}
            className="px-5 py-2 rounded-full bg-[#7D8C77] hover:bg-[#687563] text-white text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          >
            Sở Hữu Ngay
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#7D8C77]/10 text-[#7D8C77] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nghệ Thuật Móc Len Đan Tay Cao Cấp</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D2D2D] leading-[1.15]">
              Mang <span className="text-[#7D8C77]">Tĩnh Lặng</span> & Bình An Vào Không Gian Sống
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl font-normal">
              Mỗi bức tượng Phật từ **Mộc Craft** là một tác phẩm chứa đựng tâm ý chúc lành bình yên. Được dệt tay tỉ mỉ từ sợi bông hữu cơ lành tính bởi đôi bàn tay khéo léo của các nghệ nhân Việt, đem lại nguồn năng lượng an lạc trên mọi nẻo đường của bạn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href={`/products/${bestSeller.id}`}
                className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-[#E0A899] hover:bg-[#d19585] text-white font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group text-center"
              >
                Sở Hữu Tượng Phật {bestSeller.name}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#danh-muc"
                className="inline-flex justify-center items-center px-8 py-4 rounded-xl border border-[#7D8C77]/30 hover:border-[#7D8C77] text-[#7D8C77] font-medium text-base transition-all duration-300 text-center"
              >
                Khám phá bộ sưu tập
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#7D8C77]/15">
              <div>
                <span className="block font-serif text-2xl font-bold text-[#7D8C77]">100%</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Đan tay thủ công</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#7D8C77]">Organic</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Sợi bông tự nhiên</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#7D8C77]">Thanh Tịnh</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Mang năng lượng tốt</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="absolute w-72 h-72 rounded-full bg-[#E0A899]/10 -top-6 -right-6 blur-2xl z-0"></div>
            <div className="absolute w-80 h-80 rounded-full bg-[#7D8C77]/8 -bottom-10 -left-10 blur-3xl z-0"></div>
            
            <div className="relative z-10 w-full max-w-md aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              <img
                src="/buddha_crochet.png"
                alt="Tượng Phật móc len cao cấp từ Mộc Craft"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights Section */}
      <section id="dac-diem" className="py-20 bg-[#F5F2EB]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-semibold text-[#7D8C77] uppercase tracking-widest">Giá Trị Mộc Craft</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Năng Lượng Yên Bình Qua Từng Sợi Chỉ</h2>
            <div className="w-12 h-1 bg-[#E0A899] mx-auto my-2 rounded-full"></div>
            <p className="text-gray-600">Sự kết hợp tinh túy giữa nghệ thuật đan móc đong đầy chánh niệm và nét đẹp triết lý tâm linh.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FDFBF7] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left space-y-4 border border-[#7D8C77]/5">
              <div className="w-12 h-12 rounded-xl bg-[#7D8C77]/10 flex items-center justify-center text-[#7D8C77]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Bông Mộc Tự Nhiên</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Chất liệu len từ sợi bông hữu cơ nhập khẩu cao cấp, bền bỉ, không phai màu, không xù lông và hoàn toàn an toàn cho người sử dụng lẫn môi trường.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left space-y-4 border border-[#7D8C77]/5">
              <div className="w-12 h-12 rounded-xl bg-[#7D8C77]/10 flex items-center justify-center text-[#7D8C77]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Tỉ Mỉ Từng Mũi Khâu</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mỗi bức tượng đòi hỏi từ 6 đến 9 giờ đan khâu liên tục của các thợ lành nghề, được thực hiện trong không gian tĩnh lặng để gửi trọn tâm ý bình yên.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left space-y-4 border border-[#7D8C77]/5">
              <div className="w-12 h-12 rounded-xl bg-[#7D8C77]/10 flex items-center justify-center text-[#7D8C77]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Phong Thủy Cát Tường</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Được căn chỉnh tỉ lệ hài hòa, thích hợp trưng bày xe hơi để tài xế vững tay lái, hoặc đặt bàn thờ thiền, phòng trà giúp giải tỏa âu lo, thu hút vượng khí.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scrollable Product Catalog Section */}
      <section id="danh-muc" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#7D8C77] uppercase tracking-widest">Danh Mục Mộc Craft</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Các Tác Phẩm Phật Giáo Thủ Công</h2>
              <p className="text-gray-500 max-w-lg">
                Click vào sản phẩm để xem ảnh chi tiết cận cảnh giống như poster tranh cát tường và tiến hành đặt mua.
              </p>
            </div>
            
            {/* Scroll buttons */}
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button 
                onClick={() => scroll('left')} 
                className="w-10 h-10 rounded-full border border-[#7D8C77]/20 hover:border-[#7D8C77] hover:bg-[#7D8C77]/5 flex items-center justify-center text-[#7D8C77] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="w-10 h-10 rounded-full border border-[#7D8C77]/20 hover:border-[#7D8C77] hover:bg-[#7D8C77]/5 flex items-center justify-center text-[#7D8C77] transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Container */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-2 text-sm text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#7D8C77]" />
              <span>Đang đồng bộ danh mục...</span>
            </div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto space-x-6 pb-6 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-[#7D8C77]/20 scrollbar-track-transparent"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {products.map((prod) => {
                let variants = [];
                try {
                  variants = typeof prod.variantsJson === 'string' ? JSON.parse(prod.variantsJson) : prod.variants;
                } catch (e) {
                  variants = [];
                }

                return (
                  <Link 
                    href={`/products/${prod.id}`}
                    key={prod.id} 
                    className="min-w-[290px] sm:min-w-[340px] md:min-w-[370px] max-w-[370px] snap-start bg-white rounded-3xl overflow-hidden shadow-sm border border-[#7D8C77]/10 flex flex-col justify-between relative transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-pointer"
                  >
                    {prod.bestSeller && (
                      <div className="absolute top-4 right-4 bg-[#E0A899] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10 animate-pulse">
                        Bán chạy nhất
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Image container */}
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#2D2D2D]">{prod.name}</h3>
                        <p className="text-gray-500 text-xs mt-1.5 leading-relaxed min-h-[50px]">{prod.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Các tùy chọn phân loại:</span>
                        <div className="space-y-2">
                          {variants.map((v, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-gray-600 font-medium">{v.size}</span>
                              <div className="text-right">
                                <span className="font-serif font-bold text-[#E0A899] ml-2">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="w-full py-3 rounded-xl bg-[#7D8C77]/10 hover:bg-[#7D8C77] text-[#7D8C77] hover:text-white font-semibold text-xs transition-all text-center flex justify-center items-center group">
                        Xem Chi Tiết & Đặt Mua
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="cau-chuyen" className="py-20 bg-[#FDFBF7] border-t border-[#7D8C77]/5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#7D8C77]/5 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
            <img
              src="/buddha_crochet.png"
              alt="Làm móc len thủ công Mộc Craft"
              className="relative z-10 w-full rounded-3xl object-cover aspect-[4/3] shadow-md border-2 border-white"
            />
          </div>

          <div className="space-y-6 text-left">
            <span className="text-xs font-semibold text-[#7D8C77] uppercase tracking-widest">Sứ Mệnh Mộc Craft</span>
            <h2 className="font-serif text-3xl font-bold">Thêu Dệt Bình An Bằng Đôi Tay Mộc Mạc</h2>
            <div className="w-12 h-1 bg-[#E0A899]"></div>
            <p className="text-gray-600 leading-relaxed text-sm">
              Tại **Mộc Craft**, chúng tôi trân quý tính chân thật và chánh niệm trong từng khoảnh khắc đan móc. Chúng tôi tin rằng khi người nghệ nhân đan sợi với tâm thế thư thái nhất, sản phẩm làm ra cũng sẽ chứa đựng những tần số an bình nhất để truyền đến người sở hữu.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Đồng hành cùng Mộc Craft là các mẹ bỉm sữa, người khiếm thính và những người thợ khuyết tật đầy bản lĩnh. Mỗi tác phẩm ra đời không chỉ nâng đỡ cuộc sống của họ mà còn đem lại một góc tĩnh tại bình an trên bàn làm việc hay taplo xe hơi của các khách hàng thân thương.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#F5F2EB]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-semibold text-[#7D8C77] uppercase tracking-widest">Cảm Nhận Trực Quan</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Câu Chuyện Của Khách Hàng</h2>
            <div className="w-12 h-1 bg-[#E0A899] mx-auto my-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#7D8C77]/5 space-y-4">
              <div className="flex text-[#E0A899]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-600 text-sm italic">
                &ldquo;Tôi mua một bức Tượng Phật Dược Sư 12cm bày ở bàn trà góc thiền. Sợi bông hữu cơ rất khít, mềm, màu áo lam nhạt nhìn cực kỳ dễ chịu và thanh thoát.&rdquo;
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#7D8C77]">Chị Thanh Vân</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Tượng Dược Sư 12cm</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#7D8C77]/5 space-y-4">
              <div className="flex text-[#E0A899]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-600 text-sm italic">
                &ldquo;Đã nhận được tượng Di Lặc 8cm của Mộc Craft đặt trên taplo ô tô. Gói bằng hộp Kraft rất chỉn chu, mùi thơm hoa nhài rất dễ chịu. Sẽ mua thêm tượng Dược Sư để biếu mẹ.&rdquo;
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#7D8C77]">Anh Minh Trí</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Tượng Di Lặc 8cm</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#7D8C77]/5 space-y-4">
              <div className="flex text-[#E0A899]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-600 text-sm italic">
                &ldquo;Tượng Phật Thích Ca móc len nhìn hiền từ lắm. Đặt cạnh máy tính làm việc thấy áp lực công việc dịu hẳn đi. Khuyên chân thành mọi người nên có một pho tượng mộc mạc như này.&rdquo;
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#7D8C77]">Chị Mỹ Duyên</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Tượng Thích Ca 12cm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-semibold text-[#7D8C77] uppercase tracking-widest">Hỏi Đáp Gần Gũi</span>
            <h2 className="font-serif text-3xl font-bold">Các Thắc Mắc Thường Gặp</h2>
            <div className="w-12 h-1 bg-[#E0A899] mx-auto my-2 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Có thể tự vệ sinh hoặc giặt tượng bằng len Mộc Craft được không?",
                a: "Hoàn toàn được ạ. Anh chị nên giặt tay nhẹ nhàng bằng nước mát với dầu gội đầu trẻ em hoặc sữa tắm nhẹ. Bóp nhẹ để nước ráo (không vắt hay vặn xoắn làm biến dạng bông) rồi phơi khô tự nhiên trên mặt phẳng nằm ngang nơi bóng râm."
              },
              {
                q: "Tôi muốn đặt móc phối màu y phục riêng theo bản mệnh có được không?",
                a: "Dạ có. Mộc Craft có thể phối màu áo tượng (màu vàng nghệ, lam nhạt, cam saffon, đỏ trầm) để hài hòa phong thủy theo yêu cầu của anh chị. Vui lòng liên hệ hotline Zalo để trao đổi chi tiết."
              },
              {
                q: "Thời gian giao hàng và chính sách thanh toán trực tuyến thế nào?",
                a: "Mộc Craft giao hàng toàn quốc từ 2 - 4 ngày làm việc. Quý khách thanh toán nhanh qua thẻ tín dụng an toàn của Stripe (nhấn chọn sản phẩm mong muốn rồi chọn 'Sở Hữu Ngay' ở trang chi tiết) hoặc thực hiện chuyển khoản."
              }
            ].map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-medium text-sm md:text-base hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`text-[#7D8C77] font-bold text-lg transform transition-transform duration-200 ${faqOpen[i] ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {faqOpen[i] && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-[#FDFBF7] py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="font-serif text-lg font-bold tracking-wide">Mộc Craft</span>
            <p className="text-gray-400 text-xs leading-relaxed">
              Mỗi tác phẩm móc len đều đong đầy tâm ý chánh niệm và thiện lành gửi tới bạn. Tự hào sản phẩm thủ công nghệ thuật Việt Nam chất lượng cao.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wider uppercase">Bộ sưu tập</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#danh-muc" className="hover:text-white">Tượng Phật Dược Sư</a></li>
              <li><a href="#danh-muc" className="hover:text-white">Tượng Phật Thích Ca</a></li>
              <li><a href="#danh-muc" className="hover:text-white">Tượng Bồ Tát Quán Âm</a></li>
              <li><a href="#danh-muc" className="hover:text-white">Tượng Phật Di Lặc</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wider uppercase">Liên hệ hỗ trợ</h4>
            <p className="text-xs text-gray-400">Hotline: 0908 123 456 (Zalo)</p>
            <p className="text-xs text-gray-400 mt-1">Xưởng sản xuất: Quận 1, TP. Hồ Chí Minh</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Mộc Craft. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
}
