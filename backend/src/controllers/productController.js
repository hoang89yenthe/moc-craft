import prisma from '../services/db.js';

// Dữ liệu mẫu ban đầu để seed vào database
const DEFAULT_PRODUCTS = [
  {
    name: 'Tượng Phật A Di Đà',
    desc: 'Tượng Phật A Di Đà ngồi thiền tọa sen thanh tịnh, mang nét đẹp giản dị, ấm áp từ chất liệu len thủ công, chi tiết tinh tế sắc sảo.',
    bestSeller: false,
    image: '/buddha_crochet.png',
    height: '21cm',
    width: '12.5cm',
    materials: 'Len Susan family 4, Len Milk 125g',
    crochetHook: 'Fanshi 2.5mm',
    features: 'Tượng được làm thủ công, tỉ mỉ từng chi tiết.; Đảm bảo chất lượng và tính thẩm mỹ cao.; Thích hợp đặt ban thờ, kệ trang trí.',
    createdBy: 'Hằng Phạm - Mộc Craft',
    detailFace: 'Khuôn mặt hiền từ, đường nét tinh xảo',
    detailRobe: 'Y áo tỉ mỉ, viền kim tuyến sang trọng',
    detailHand: 'Tay cầm hoa sen thanh tịnh',
    detailQuality: 'Từng chi tiết được móc chắc chắn',
    variantsJson: JSON.stringify([
      { key: 'ADiDa_21cm', size: 'Size 21cm (Đặt bàn/Kệ)', price: 499000, usage: 'Phù hợp đặt bàn thờ, kệ trang trí' }
    ])
  },
  {
    name: 'Tượng Phật Dược Sư',
    desc: 'Tượng Phật Dược Sư (Bhaisajyaguru) tượng trưng cho sự chữa lành, cầu sức khỏe dồi dào, hóa giải tật ách và mang lại cát tường cho gia quyến.',
    bestSeller: true,
    image: '/buddha_crochet.png',
    height: '12cm',
    width: '8.5cm',
    materials: 'Len Susan family 4, Len Milk 125g',
    crochetHook: 'Fanshi 2.5mm',
    features: 'Móc tay tỉ mỉ từng mũi khâu chánh niệm.; Thân tượng phối màu xanh lưu lý thanh cao.; Phù hợp đặt bàn làm việc giúp an nhiên.',
    createdBy: 'Hằng Phạm - Mộc Craft',
    detailFace: 'Thần thái từ bi, nhắm mắt thiền định',
    detailRobe: 'Y áo màu xanh ngọc lam dịu nhẹ',
    detailHand: 'Tay nâng bình thuốc cam lồ cầu an',
    detailQuality: 'Đế lót sen chắc chắn bền đẹp',
    variantsJson: JSON.stringify([
      { key: 'DuocSu_10cm', size: 'Size 10cm (Bàn làm việc)', price: 399000, usage: 'Đặt bàn học, bàn làm việc, phòng thiền trà' },
      { key: 'DuocSu_12cm', size: 'Size 12cm (Kệ trang trí)', price: 499000, usage: 'Đặt kệ sách, phòng khách, tủ trưng bày' }
    ])
  },
  {
    name: 'Tượng Phật Thích Ca Mâu Ni',
    desc: 'Đức Thích Ca ngồi thiền định thư thái trên tòa sen, mang đến sự tập trung cao độ, khai sáng trí tuệ và sự tĩnh lặng tối đa cho không gian sống.',
    bestSeller: false,
    image: '/buddha_crochet.png',
    height: '12cm',
    width: '8cm',
    materials: 'Len Susan family 4, Cotton Việt Nam',
    crochetHook: 'Tulip 2.2mm',
    features: 'Đan móc thủ công chánh niệm.; Tạo hình tóc xoắn ốc tinh tế.; Đem lại cảm giác thư thái bình an.',
    createdBy: 'Hằng Phạm - Mộc Craft',
    detailFace: 'Diện mạo an nhiên, tự tại',
    detailRobe: 'Y phục màu vàng nghệ truyền thống',
    detailHand: 'Tay thủ ấn Thiền định tĩnh lặng',
    detailQuality: 'Sợi len organic khít đều đẹp mắt',
    variantsJson: JSON.stringify([
      { key: 'ThichCa_8cm', size: 'Size 8cm (Taplo xe hơi)', price: 299000, usage: 'Tặng kèm miếng dán taplo chống trượt' },
      { key: 'ThichCa_12cm', size: 'Size 12cm (Kệ trang trí)', price: 499000, usage: 'Đế sen lót gỗ cao cấp' }
    ])
  },
  {
    name: 'Tượng Bồ Tát Quán Thế Âm',
    desc: 'Hiện thân của lòng đại từ đại bi, che chở và cứu khổ cứu nạn. Mang lại may mắn, bình an trên vạn dặm hành trình của bạn.',
    bestSeller: false,
    image: '/buddha_crochet.png',
    height: '12cm',
    width: '9cm',
    materials: 'Len Susan family 4, Sợi bông hữu cơ',
    crochetHook: 'Fanshi 2.5mm',
    features: 'Đan móc thủ công khép kín.; Trang trí ngọc trai nhân tạo sang trọng.; Mang phúc đức, bình an cho gia đạo.',
    createdBy: 'Hằng Phạm - Mộc Craft',
    detailFace: 'Khuôn mặt thánh thiện, từ ái',
    detailRobe: 'Y phục trắng tinh khôi, viền thêu nổi',
    detailHand: 'Tay cầm bình cam lồ bình an',
    detailQuality: 'Độ bền cao, có thể giặt nhẹ nhàng',
    variantsJson: JSON.stringify([
      { key: 'QuanAm_10cm', size: 'Size 10cm (Góc làm việc)', price: 399000, usage: 'Thích hợp đặt nơi yên tĩnh, làm quà tặng' },
      { key: 'QuanAm_12cm', size: 'Size 12cm (Không gian thiền)', price: 499000, usage: 'Trang trí phòng khách, xe du lịch cỡ lớn' }
    ])
  }
];

/**
 * Tự động chèn dữ liệu mẫu nếu DB trống
 */
export const seedDefaultProducts = async () => {
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      console.log('[Database Seed] Đang nạp dữ liệu sản phẩm mặc định...');
      for (const p of DEFAULT_PRODUCTS) {
        await prisma.product.create({ data: p });
      }
      console.log('[Database Seed] Đã hoàn tất nạp dữ liệu hạt giống.');
    }
  } catch (error) {
    console.error('[Database Seed Error] Lỗi khi seed sản phẩm:', error);
  }
};

/**
 * Lấy tất cả sản phẩm
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    return res.status(500).json({ error: 'Không thể tải danh sách sản phẩm.' });
  }
};

/**
 * Lấy chi tiết một sản phẩm theo ID
 */
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    return res.status(500).json({ error: 'Không thể tải chi tiết sản phẩm.' });
  }
};

/**
 * Tạo sản phẩm mới
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name, desc, bestSeller, image, height, width,
      materials, crochetHook, features, createdBy,
      detailFace, detailRobe, detailHand, detailQuality, variantsJson
    } = req.body;

    if (!name || !desc || !image || !variantsJson) {
      return res.status(400).json({ error: 'Vui lòng cung cấp các thông tin bắt buộc: Tên, Mô tả, Hình ảnh và Phân loại giá.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        desc,
        bestSeller: bestSeller || false,
        image,
        height: height || '12cm',
        width: width || '8cm',
        materials: materials || 'Len Susan family 4',
        crochetHook: crochetHook || 'Fanshi 2.5mm',
        features: features || 'Được làm thủ công tỉ mỉ.',
        createdBy: createdBy || 'Hằng Phạm - Mộc Craft',
        detailFace: detailFace || 'Khuôn mặt hiền từ, đường nét tinh xảo',
        detailRobe: detailRobe || 'Y áo tỉ mỉ, viền kim tuyến sang trọng',
        detailHand: detailHand || 'Tay cầm hoa sen thanh tịnh',
        detailQuality: detailQuality || 'Từng chi tiết được móc chắc chắn',
        variantsJson
      }
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Lỗi tạo sản phẩm:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi tạo sản phẩm mới.' });
  }
};

/**
 * Cập nhật sản phẩm
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name, desc, bestSeller, image, height, width,
      materials, crochetHook, features, createdBy,
      detailFace, detailRobe, detailHand, detailQuality, variantsJson
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm cần cập nhật.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        desc: desc !== undefined ? desc : existingProduct.desc,
        bestSeller: bestSeller !== undefined ? bestSeller : existingProduct.bestSeller,
        image: image !== undefined ? image : existingProduct.image,
        height: height !== undefined ? height : existingProduct.height,
        width: width !== undefined ? width : existingProduct.width,
        materials: materials !== undefined ? materials : existingProduct.materials,
        crochetHook: crochetHook !== undefined ? crochetHook : existingProduct.crochetHook,
        features: features !== undefined ? features : existingProduct.features,
        createdBy: createdBy !== undefined ? createdBy : existingProduct.createdBy,
        detailFace: detailFace !== undefined ? detailFace : existingProduct.detailFace,
        detailRobe: detailRobe !== undefined ? detailRobe : existingProduct.detailRobe,
        detailHand: detailHand !== undefined ? detailHand : existingProduct.detailHand,
        detailQuality: detailQuality !== undefined ? detailQuality : existingProduct.detailQuality,
        variantsJson: variantsJson !== undefined ? variantsJson : existingProduct.variantsJson
      }
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi cập nhật sản phẩm.' });
  }
};

/**
 * Xóa sản phẩm
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm cần xóa.' });
    }

    await prisma.product.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Xóa sản phẩm thành công.' });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi xóa sản phẩm.' });
  }
};
