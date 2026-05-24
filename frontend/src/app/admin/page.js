'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('/buddha_crochet.png');
  const [bestSeller, setBestSeller] = useState(false);
  const [height, setHeight] = useState('12cm');
  const [width, setWidth] = useState('8cm');
  const [materials, setMaterials] = useState('Len Susan family 4, Len Milk 125g');
  const [crochetHook, setCrochetHook] = useState('Fanshi 2.5mm');
  const [features, setFeatures] = useState('Tượng được làm thủ công, tỉ mỉ từng chi tiết.; Đảm bảo tính thẩm mỹ cao.');
  const [detailFace, setDetailFace] = useState('Khuôn mặt hiền từ, đường nét tinh xảo');
  const [detailRobe, setDetailRobe] = useState('Y áo tỉ mỉ, viền kim tuyến sang trọng');
  const [detailHand, setDetailHand] = useState('Tay cầm hoa sen thanh tịnh');
  const [detailQuality, setDetailQuality] = useState('Từng chi tiết được móc chắc chắn');

  // Product variants state: Array of { key, size, price, usage }
  const [variants, setVariants] = useState([
    { key: '', size: '', price: 0, usage: '' }
  ]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setErrorMessage('Không thể tải danh sách sản phẩm từ backend.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Lỗi kết nối đến máy chủ API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDesc('');
    setImage('/buddha_crochet.png');
    setBestSeller(false);
    setHeight('12cm');
    setWidth('8cm');
    setMaterials('Len Susan family 4, Len Milk 125g');
    setCrochetHook('Fanshi 2.5mm');
    setFeatures('Tượng được làm thủ công, tỉ mỉ từng chi tiết.; Đảm bảo tính thẩm mỹ cao.');
    setDetailFace('Khuôn mặt hiền từ, đường nét tinh xảo');
    setDetailRobe('Y áo tỉ mỉ, viền kim tuyến sang trọng');
    setDetailHand('Tay cầm hoa sen thanh tịnh');
    setDetailQuality('Từng chi tiết được móc chắc chắn');
    setVariants([{ key: 'DuocSu_12cm', size: 'Size 12cm (Kệ trang trí)', price: 499000, usage: 'Đặt kệ sách, phòng trưng bày' }]);
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDesc(product.desc);
    setImage(product.image);
    setBestSeller(product.bestSeller);
    setHeight(product.height);
    setWidth(product.width);
    setMaterials(product.materials);
    setCrochetHook(product.crochetHook);
    setFeatures(product.features);
    setDetailFace(product.detailFace);
    setDetailRobe(product.detailRobe);
    setDetailHand(product.detailHand);
    setDetailQuality(product.detailQuality);
    
    try {
      const parsedVariants = JSON.parse(product.variantsJson);
      setVariants(parsedVariants);
    } catch (e) {
      setVariants([{ key: '', size: '', price: 0, usage: '' }]);
    }
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  // Add/remove/edit variant helpers
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setVariants(updated);
  };

  const addVariantField = () => {
    setVariants([...variants, { key: '', size: '', price: 0, usage: '' }]);
  };

  const removeVariantField = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (variants.some(v => !v.key || !v.size || v.price <= 0)) {
      setErrorMessage('Vui lòng hoàn thành thông tin phân loại: Key, Size và Giá phải lớn hơn 0.');
      return;
    }

    const payload = {
      name,
      desc,
      bestSeller,
      image,
      height,
      width,
      materials,
      crochetHook,
      features,
      detailFace,
      detailRobe,
      detailHand,
      detailQuality,
      variantsJson: JSON.stringify(variants)
    };

    try {
      const url = editingProduct ? `${apiUrl}/products/${editingProduct.id}` : `${apiUrl}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        fetchProducts();
        setTimeout(() => setModalOpen(false), 1500);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Có lỗi xảy ra khi lưu sản phẩm.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setErrorMessage('Lỗi mạng khi lưu sản phẩm.');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccessMessage('Xóa sản phẩm thành công!');
        fetchProducts();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Có lỗi xảy ra khi xóa sản phẩm.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Lỗi kết nối khi xóa sản phẩm.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#7D8C77]/15">
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center text-xs text-[#7D8C77] hover:underline mb-2">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Quay về Trang chủ
            </Link>
            <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#7D8C77]" />
              Quản Trị Tác Phẩm Mộc Craft
            </h1>
            <p className="text-gray-500 text-sm">Thêm, sửa, xóa các tác phẩm tượng Phật móc len hữu cơ.</p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-[#7D8C77] hover:bg-[#687563] text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm Tác Phẩm
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="p-4 bg-green-50 text-green-800 text-sm rounded-xl border border-green-200">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-800 text-sm rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorMessage}
          </div>
        )}

        {/* Main List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-gray-400 text-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#7D8C77]" />
            <span>Đang tải danh sách tác phẩm...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#7D8C77]/10 space-y-4">
            <p className="text-gray-500">Chưa có sản phẩm nào trong cơ sở dữ liệu.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 text-xs border border-[#7D8C77] text-[#7D8C77] rounded-lg font-medium hover:bg-[#7D8C77] hover:text-white transition-colors cursor-pointer"
            >
              Thêm sản phẩm đầu tiên
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#7D8C77]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F5F2EB] text-[#7D8C77] font-semibold uppercase tracking-wider text-xs border-b border-[#7D8C77]/10">
                    <th className="p-4">Hình ảnh</th>
                    <th className="p-4">Tên tác phẩm</th>
                    <th className="p-4">Kích thước</th>
                    <th className="p-4">Nguyên liệu</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="font-serif font-bold text-base block text-gray-800">{prod.name}</span>
                          <span className="text-xs text-gray-400 line-clamp-1 max-w-[250px]">{prod.desc}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-600">
                        {prod.height} × {prod.width}
                      </td>
                      <td className="p-4 text-xs text-gray-500 max-w-[180px] truncate">
                        {prod.materials}
                      </td>
                      <td className="p-4">
                        {prod.bestSeller ? (
                          <span className="px-2 py-0.5 bg-[#E0A899]/15 text-[#E0A899] font-bold text-[10px] uppercase rounded-full border border-[#E0A899]/30">
                            Bán Chạy
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 border border-gray-200 hover:border-[#7D8C77] text-gray-600 hover:text-[#7D8C77] rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-2 border border-gray-200 hover:border-red-500 text-gray-600 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FDFBF7]">
              <div>
                <h3 className="font-serif text-xl font-bold">{editingProduct ? 'Sửa Tác Phẩm' : 'Thêm Tác Phẩm Mới'}</h3>
                <p className="text-xs text-gray-500 mt-1">Cấu hình các thông số chi tiết và phân loại giá bán</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tên tác phẩm *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Tượng Phật A Di Đà"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#7D8C77] bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ảnh chính sản phẩm (URL) *</label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#7D8C77] bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả sản phẩm *</label>
                <textarea
                  required
                  rows="2"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ghi dòng giới thiệu an lạc cho tác phẩm..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#7D8C77] bg-gray-50 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bestSeller"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                  className="w-4 h-4 text-[#7D8C77] border-gray-300 rounded focus:ring-[#7D8C77]"
                />
                <label htmlFor="bestSeller" className="text-xs font-bold uppercase tracking-wider text-gray-500 cursor-pointer">
                  Đặt làm sản phẩm Bán Chạy (Best Seller)
                </label>
              </div>

              {/* Technical specs matching the image layout */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D8C77] block">Thông số thiết kế (Giống ảnh mẫu)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Chiều cao (Ví dụ: 21cm) *</label>
                    <input
                      type="text"
                      required
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Chiều ngang (Ví dụ: 12.5cm) *</label>
                    <input
                      type="text"
                      required
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nguyên liệu (sợi bông/len) *</label>
                    <input
                      type="text"
                      required
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      placeholder="Susan family 4, Milk 125g..."
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mã kim móc *</label>
                    <input
                      type="text"
                      required
                      value={crochetHook}
                      onChange={(e) => setCrochetHook(e.target.value)}
                      placeholder="Fanshi 2.5mm..."
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Đặc điểm nổi bật (phân cách bằng dấu chấm phẩy ;) *</label>
                  <input
                    type="text"
                    required
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="Móc thủ công tỉ mỉ; Đảm bảo tính thẩm mỹ cao..."
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
              </div>

              {/* Bottom 4 details captions */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7D8C77] block">Mô tả 4 chi tiết sản phẩm (Dưới ảnh chi tiết)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Chi tiết 1: Khuôn mặt *</label>
                    <input
                      type="text"
                      required
                      value={detailFace}
                      onChange={(e) => setDetailFace(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Chi tiết 2: Y áo *</label>
                    <input
                      type="text"
                      required
                      value={detailRobe}
                      onChange={(e) => setDetailRobe(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Chi tiết 3: Tay cầm sen *</label>
                    <input
                      type="text"
                      required
                      value={detailHand}
                      onChange={(e) => setDetailHand(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Chi tiết 4: Độ bền / Chắc chắn *</label>
                    <input
                      type="text"
                      required
                      value={detailQuality}
                      onChange={(e) => setDetailQuality(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Variants sizes & prices editor */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7D8C77]">4. Cấu hình phân loại Size & Giá bán *</span>
                  <button
                    type="button"
                    onClick={addVariantField}
                    className="px-3 py-1 text-xs border border-[#7D8C77] text-[#7D8C77] rounded hover:bg-[#7D8C77]/5 cursor-pointer"
                  >
                    + Thêm Size
                  </button>
                </div>

                <div className="space-y-3">
                  {variants.map((v, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3 relative border border-gray-150">
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantField(index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Mã Phân Loại (Key) *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: ADiDa_21cm"
                            value={v.key}
                            onChange={(e) => handleVariantChange(index, 'key', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Tên Phân Loại (Size) *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: Size 21cm"
                            value={v.size}
                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase">Giá Bán (VNĐ) *</label>
                          <input
                            type="number"
                            required
                            placeholder="Ví dụ: 499000"
                            value={v.price || ''}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Khuyên Dùng / Gợi ý vị trí</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Phù hợp đặt xe hơi, kệ sách..."
                          value={v.usage}
                          onChange={(e) => handleVariantChange(index, 'usage', e.target.value)}
                          className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#7D8C77] hover:bg-[#687563] text-white font-semibold transition-all shadow-md flex justify-center items-center cursor-pointer"
              >
                {editingProduct ? 'Lưu Thay Đổi' : 'Thêm Tác Phẩm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
