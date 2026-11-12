import type { BodyType, Vehicle } from '@/types'

/**
 * DỮ LIỆU CÁC DÒNG XE
 * ---------------------------------------------------------------------------
 * ⚠ Giá & thông số dưới đây là DỮ LIỆU THAM KHẢO, cần đối chiếu và cập nhật
 *   theo bảng giá/catalogue chính thức (xem `sourceUrl` của từng mẫu xe)
 *   trước khi đưa website vào vận hành. Sau khi đối chiếu, đặt
 *   `pricing.verified = true` trong src/config/site.ts.
 *
 * - `price: null`  => hiển thị "Liên hệ" (dùng cho mẫu xe mới chưa có giá).
 * - Ảnh xe: public/images/cars/<slug>/ (sinh từ src/assets/images/cars/<slug>/source.png
 *   bằng `npm run images`). Nguồn ảnh: hyundai.thanhcong.vn.
 */

const OFFICIAL = 'https://hyundai.thanhcong.vn'

export const vehicles: Vehicle[] = [
  {
    slug: 'grand-i10',
    name: 'Hyundai Grand i10',
    model: 'Grand i10',
    bodyType: 'hatchback',
    segment: 'Hatchback hạng A',
    tagline: 'Nhỏ gọn, linh hoạt cho phố thị',
    description:
      'Mẫu xe đô thị cỡ nhỏ dễ lái, tiết kiệm nhiên liệu, phù hợp gia đình trẻ và nhu cầu di chuyển hằng ngày.',
    overview: [
      'Hyundai Grand i10 là lựa chọn quen thuộc trong phân khúc xe đô thị cỡ nhỏ tại Việt Nam nhờ kích thước gọn gàng, khả năng xoay trở linh hoạt trong phố đông và chi phí vận hành hợp lý.',
      'Khoang cabin được bố trí hợp lý cho 5 người, khoang hành lý đủ dùng cho nhu cầu gia đình. Xe phù hợp với người mua xe lần đầu, gia đình trẻ hoặc nhu cầu kinh doanh dịch vụ.',
    ],
    imageAlt: 'Xe Hyundai Grand i10 hatchback màu đỏ, góc nghiêng phía trước',
    seats: '5 chỗ',
    highlights: [
      { label: 'Động cơ', value: 'Xăng 1.2L' },
      { label: 'Hộp số', value: 'Số sàn / Tự động' },
      { label: 'Số chỗ', value: '5 chỗ' },
      { label: 'Kiểu dáng', value: 'Hatchback' },
    ],
    features: [
      'Kích thước nhỏ gọn, bán kính quay vòng nhỏ',
      'Màn hình giải trí trung tâm, kết nối điện thoại',
      'Khoang hành lý linh hoạt với hàng ghế sau gập',
      'Chi phí bảo dưỡng hợp lý',
    ],
    versions: [
      { name: '1.2 MT Tiêu chuẩn', price: 360_000_000 },
      { name: '1.2 MT', price: 405_000_000 },
      { name: '1.2 AT', price: 435_000_000 },
    ],
    sourceUrl: `${OFFICIAL}/new-grand-i10`,
    seoKeywords: ['giá xe Hyundai Grand i10', 'Grand i10 hatchback'],
  },
  {
    slug: 'accent',
    name: 'Hyundai Accent',
    model: 'Accent',
    bodyType: 'sedan',
    segment: 'Sedan hạng B',
    tagline: 'Sedan hạng B thế hệ mới',
    description:
      'Thiết kế trẻ trung, khoang cabin rộng rãi cùng nhiều trang bị tiện nghi và an toàn trong tầm giá.',
    overview: [
      'Hyundai Accent thế hệ mới mang ngôn ngữ thiết kế hiện đại với dải đèn LED định vị trải ngang, thân xe dài và khoang cabin rộng hơn đáng kể so với thế hệ trước.',
      'Động cơ Smartstream 1.5L kết hợp hộp số vô cấp IVT trên các bản tự động mang lại cảm giác lái êm ái, tiết kiệm nhiên liệu. Các phiên bản cao cấp được trang bị gói an toàn Hyundai SmartSense.',
    ],
    imageAlt: 'Xe Hyundai Accent sedan thế hệ mới, góc nghiêng phía trước',
    seats: '5 chỗ',
    highlights: [
      { label: 'Động cơ', value: 'Smartstream 1.5L' },
      { label: 'Hộp số', value: 'MT / IVT' },
      { label: 'Số chỗ', value: '5 chỗ' },
      { label: 'An toàn', value: 'SmartSense*' },
    ],
    features: [
      'Đèn LED định vị dạng dải ngang đặc trưng',
      'Màn hình kỹ thuật số và màn hình giải trí kích thước lớn',
      'Gói an toàn Hyundai SmartSense (tùy phiên bản)',
      'Khoang cabin và khoang hành lý rộng rãi',
    ],
    versions: [
      { name: '1.5 MT', price: 439_000_000 },
      { name: '1.5 AT', price: 489_000_000 },
      { name: '1.5 AT Đặc biệt', price: 529_000_000 },
      { name: '1.5 AT Cao cấp', price: 569_000_000 },
    ],
    featured: false,
    sourceUrl: `${OFFICIAL}/all-new-accent`,
    seoKeywords: ['Hyundai Accent', 'giá xe Accent'],
  },
  {
    slug: 'elantra',
    name: 'Hyundai Elantra',
    model: 'Elantra',
    bodyType: 'sedan',
    segment: 'Sedan hạng C',
    tagline: 'Thiết kế thể thao, cá tính',
    description:
      'Sedan hạng C với ngôn ngữ thiết kế góc cạnh, cabin hướng về người lái và lựa chọn động cơ đa dạng.',
    overview: [
      'Hyundai Elantra nổi bật với thiết kế mặt ca-lăng tham số và các đường gân dập nổi mạnh mẽ, tạo dáng vẻ thể thao khác biệt trong phân khúc sedan hạng C.',
      'Khoang lái được thiết kế hướng về người lái với cụm màn hình liền khối. Xe có nhiều lựa chọn động cơ và phiên bản để phù hợp với nhu cầu từ gia đình đến người yêu thích cảm giác lái.',
    ],
    imageAlt: 'Xe Hyundai Elantra sedan, góc nghiêng phía trước',
    seats: '5 chỗ',
    highlights: [
      { label: 'Động cơ', value: '1.6L / 2.0L / 1.6 Turbo' },
      { label: 'Hộp số', value: 'Tự động' },
      { label: 'Số chỗ', value: '5 chỗ' },
      { label: 'Kiểu dáng', value: 'Sedan' },
    ],
    features: [
      'Thiết kế mặt ca-lăng tham số đặc trưng',
      'Cụm màn hình liền khối hướng về người lái',
      'Nhiều lựa chọn động cơ, bao gồm bản Turbo',
      'Trang bị an toàn chủ động (tùy phiên bản)',
    ],
    versions: [
      { name: '1.6 AT Tiêu chuẩn', price: 599_000_000 },
      { name: '1.6 AT Đặc biệt', price: 669_000_000 },
      { name: '2.0 AT Cao cấp', price: 729_000_000 },
      { name: '1.6 Turbo N Line', price: 769_000_000 },
    ],
    sourceUrl: `${OFFICIAL}/elantra`,
    seoKeywords: ['Hyundai Elantra', 'giá xe Elantra'],
  },
  {
    slug: 'venue',
    name: 'Hyundai Venue',
    model: 'Venue',
    bodyType: 'suv',
    segment: 'SUV đô thị hạng A',
    tagline: 'SUV đô thị nhỏ gọn, cá tính',
    description:
      'SUV cỡ nhỏ năng động với động cơ tăng áp, gầm cao, phù hợp di chuyển trong thành phố.',
    overview: [
      'Hyundai Venue là mẫu SUV đô thị cỡ nhỏ với thiết kế vuông vức, khỏe khoắn, khoảng sáng gầm tốt giúp tự tin hơn trên các cung đường đô thị.',
      'Động cơ tăng áp dung tích nhỏ kết hợp hộp số ly hợp kép mang lại khả năng tăng tốc linh hoạt và tiết kiệm nhiên liệu.',
    ],
    imageAlt: 'Xe Hyundai Venue SUV đô thị màu xanh, góc nghiêng phía trước',
    seats: '5 chỗ',
    highlights: [
      { label: 'Động cơ', value: '1.0 T-GDi' },
      { label: 'Hộp số', value: 'Ly hợp kép 7 cấp' },
      { label: 'Số chỗ', value: '5 chỗ' },
      { label: 'Kiểu dáng', value: 'SUV đô thị' },
    ],
    features: [
      'Thiết kế SUV vuông vức, gầm cao',
      'Động cơ tăng áp tiết kiệm nhiên liệu',
      'Kích thước nhỏ gọn, dễ đỗ xe',
      'Kết nối điện thoại thông minh',
    ],
    versions: [
      { name: '1.0 T-GDi Tiêu chuẩn', price: 539_000_000 },
      { name: '1.0 T-GDi Đặc biệt', price: 579_000_000 },
    ],
    sourceUrl: `${OFFICIAL}/san-pham/venue`,
    seoKeywords: ['Hyundai Venue', 'giá xe Venue'],
  },
  {
    slug: 'creta',
    name: 'Hyundai Creta',
    model: 'Creta',
    bodyType: 'suv',
    segment: 'SUV hạng B',
    tagline: 'SUV hạng B hiện đại, thực dụng',
    description:
      'Thiết kế mạnh mẽ, nội thất rộng rãi và nhiều tiện nghi – lựa chọn SUV đô thị cân bằng cho gia đình.',
    overview: [
      'Hyundai Creta thế hệ mới sở hữu thiết kế mặt trước mạnh mẽ với lưới tản nhiệt cỡ lớn và cụm đèn LED hiện đại, đi cùng khoảng sáng gầm cao phù hợp điều kiện đường sá Việt Nam.',
      'Khoang cabin rộng rãi, nhiều tiện nghi như màn hình giải trí, sạc không dây và cửa sổ trời trên các phiên bản cao. Các bản cao cấp được trang bị gói an toàn Hyundai SmartSense.',
    ],
    imageAlt: 'Xe Hyundai Creta SUV màu đỏ, góc nghiêng phía trước',
    seats: '5 chỗ',
    highlights: [
      { label: 'Động cơ', value: 'Smartstream 1.5L' },
      { label: 'Hộp số', value: 'IVT' },
      { label: 'Số chỗ', value: '5 chỗ' },
      { label: 'An toàn', value: 'SmartSense*' },
    ],
    features: [
      'Thiết kế SUV mạnh mẽ, gầm cao',
      'Màn hình giải trí, sạc không dây (tùy phiên bản)',
      'Gói an toàn Hyundai SmartSense (tùy phiên bản)',
      'Cabin rộng, hàng ghế sau thoải mái',
    ],
    versions: [
      { name: '1.5 Tiêu chuẩn', price: 599_000_000 },
      { name: '1.5 Đặc biệt', price: 659_000_000 },
      { name: '1.5 Cao cấp', price: 705_000_000 },
    ],
    featured: false,
    sourceUrl: `${OFFICIAL}/san-pham/new-creta`,
    seoKeywords: ['Hyundai Creta', 'giá xe Creta'],
  },
  {
    slug: 'tucson',
    name: 'Hyundai Tucson',
    model: 'Tucson',
    bodyType: 'suv',
    segment: 'SUV hạng C',
    tagline: 'SUV hạng C, công nghệ dẫn đầu',
    description:
      'Thiết kế đèn ẩn tham số độc đáo, khoang lái công nghệ cao, nhiều lựa chọn động cơ xăng, dầu và tăng áp.',
    overview: [
      'Hyundai Tucson nổi bật với hệ thống đèn định vị ẩn trong lưới tản nhiệt tham số – một trong những thiết kế dễ nhận diện nhất phân khúc SUV hạng C.',
      'Bản nâng cấp mang đến khoang lái mới với màn hình cong liền khối, cần số sau vô-lăng giúp giải phóng không gian bệ trung tâm. Xe có nhiều lựa chọn động cơ, đáp ứng từ nhu cầu gia đình đến đường dài.',
    ],
    imageAlt: 'Xe Hyundai Tucson SUV màu đỏ, góc nghiêng phía trước',
    seats: '5 chỗ',
    highlights: [
      { label: 'Động cơ', value: 'Xăng / Dầu / Turbo' },
      { label: 'Dẫn động', value: 'FWD / HTRAC*' },
      { label: 'Số chỗ', value: '5 chỗ' },
      { label: 'An toàn', value: 'SmartSense*' },
    ],
    features: [
      'Đèn định vị ẩn trong lưới tản nhiệt tham số',
      'Màn hình cong liền khối, cần số sau vô-lăng',
      'Hệ dẫn động HTRAC (tùy phiên bản)',
      'Gói an toàn Hyundai SmartSense (tùy phiên bản)',
    ],
    versions: [
      { name: '2.0 Xăng Tiêu chuẩn', price: 769_000_000 },
      { name: '2.0 Xăng Đặc biệt', price: 859_000_000 },
      { name: '2.0 Dầu Đặc biệt', price: 979_000_000 },
      { name: '1.6 Turbo HTRAC Đặc biệt', price: 989_000_000 },
    ],
    featured: true,
    sourceUrl: `${OFFICIAL}/san-pham/tucson`,
    seoKeywords: ['Hyundai Tucson', 'giá xe Tucson'],
  },
  {
    slug: 'santa-fe',
    name: 'Hyundai Santa Fe',
    model: 'Santa Fe',
    bodyType: 'suv',
    segment: 'SUV hạng D',
    tagline: 'SUV 7 chỗ cho mọi hành trình',
    description:
      'Thiết kế vuông vức đậm chất phiêu lưu, khoang cabin 7 chỗ rộng rãi và cốp sau cỡ lớn.',
    overview: [
      'Hyundai Santa Fe thế hệ mới thay đổi hoàn toàn với thiết kế hình hộp vuông vức, đèn chữ H đặc trưng và cửa cốp cỡ lớn, nhấn mạnh tinh thần phiêu lưu và không gian.',
      'Khoang cabin rộng rãi cho cả ba hàng ghế, nhiều tiện nghi cao cấp và gói an toàn Hyundai SmartSense. Xe có lựa chọn động cơ xăng, tăng áp và hybrid tùy phiên bản.',
    ],
    imageAlt: 'Xe Hyundai Santa Fe SUV 7 chỗ, góc nghiêng phía trước',
    seats: '6 – 7 chỗ',
    highlights: [
      { label: 'Động cơ', value: 'Xăng / Turbo / Hybrid*' },
      { label: 'Dẫn động', value: 'FWD / HTRAC*' },
      { label: 'Số chỗ', value: '6 – 7 chỗ' },
      { label: 'An toàn', value: 'SmartSense' },
    ],
    features: [
      'Thiết kế hình hộp, đèn chữ H đặc trưng',
      'Ba hàng ghế rộng rãi, cốp sau cỡ lớn',
      'Màn hình cong kép liền khối',
      'Gói an toàn Hyundai SmartSense',
    ],
    versions: [
      { name: '2.5 Exclusive', price: 1_069_000_000 },
      { name: '2.5 Prestige', price: 1_265_000_000 },
      { name: '2.5 Turbo Calligraphy', price: 1_315_000_000 },
      { name: '1.6 Turbo Hybrid Calligraphy', price: 1_365_000_000 },
    ],
    featured: true,
    sourceUrl: `${OFFICIAL}/san-pham/santa-fe`,
    seoKeywords: ['Hyundai Santa Fe', 'giá xe Santa Fe'],
  },
  {
    slug: 'stargazer',
    name: 'Hyundai Stargazer',
    model: 'Stargazer',
    bodyType: 'mpv',
    segment: 'MPV 7 chỗ cỡ nhỏ',
    tagline: 'MPV 7 chỗ cho gia đình',
    description:
      'MPV 7 chỗ thực dụng, không gian linh hoạt, phù hợp gia đình đông thành viên và kinh doanh dịch vụ.',
    overview: [
      'Hyundai Stargazer là mẫu MPV 7 chỗ cỡ nhỏ với không gian ba hàng ghế linh hoạt, nhiều hộc chứa đồ và cửa sổ lớn giúp cabin thoáng đãng.',
      'Xe hướng đến các gia đình cần một chiếc xe rộng rãi, dễ sử dụng với chi phí vận hành hợp lý. Thông tin phiên bản và giá của mẫu xe mới vui lòng liên hệ để được cập nhật.',
    ],
    imageAlt: 'Xe Hyundai Stargazer MPV 7 chỗ, góc nghiêng phía trước',
    seats: '7 chỗ',
    highlights: [
      { label: 'Động cơ', value: 'Smartstream 1.5L' },
      { label: 'Hộp số', value: 'IVT' },
      { label: 'Số chỗ', value: '7 chỗ' },
      { label: 'Kiểu dáng', value: 'MPV' },
    ],
    features: [
      'Ba hàng ghế linh hoạt',
      'Nhiều hộc chứa đồ tiện dụng',
      'Cửa sổ lớn, cabin thoáng',
      'Chi phí vận hành hợp lý',
    ],
    versions: [{ name: 'Phiên bản mới', price: null }],
    sourceUrl: `${OFFICIAL}/stargazer`,
    seoKeywords: ['Hyundai Stargazer', 'xe 7 chỗ Hyundai'],
  },
  {
    slug: 'custin',
    name: 'Hyundai Custin',
    model: 'Custin',
    bodyType: 'mpv',
    segment: 'MPV cỡ trung',
    tagline: 'MPV cao cấp, tiện nghi hạng thương gia',
    description:
      'MPV cỡ trung với cửa trượt điện, hàng ghế thứ hai thương gia và động cơ tăng áp mạnh mẽ.',
    overview: [
      'Hyundai Custin là mẫu MPV cỡ trung hướng tới sự tiện nghi với cửa trượt hai bên, hàng ghế thứ hai dạng thương gia có bệ đỡ chân và không gian cabin rộng.',
      'Động cơ xăng tăng áp mang lại khả năng vận hành mạnh mẽ, êm ái – phù hợp với gia đình cần sự thoải mái hoặc doanh nghiệp đưa đón khách.',
    ],
    imageAlt: 'Xe Hyundai Custin MPV cỡ trung, góc nghiêng phía trước',
    seats: '7 chỗ',
    highlights: [
      { label: 'Động cơ', value: 'Xăng tăng áp' },
      { label: 'Hộp số', value: 'Tự động 8 cấp' },
      { label: 'Số chỗ', value: '7 chỗ' },
      { label: 'Cửa', value: 'Trượt điện*' },
    ],
    features: [
      'Cửa trượt hai bên (điện, tùy phiên bản)',
      'Hàng ghế thứ hai dạng thương gia',
      'Cabin rộng rãi, cách âm tốt',
      'Động cơ tăng áp mạnh mẽ',
    ],
    versions: [
      { name: '1.5T Tiêu chuẩn', price: 820_000_000 },
      { name: '1.5T Đặc biệt', price: 914_000_000 },
      { name: '2.0T Cao cấp', price: 999_000_000 },
    ],
    sourceUrl: `${OFFICIAL}/custin`,
    seoKeywords: ['Hyundai Custin', 'giá xe Custin'],
  },
  {
    slug: 'palisade',
    name: 'Hyundai Palisade',
    model: 'Palisade',
    bodyType: 'suv',
    segment: 'SUV cỡ lớn',
    tagline: 'SUV cỡ lớn đầu bảng',
    description:
      'SUV cỡ lớn với thiết kế bề thế, khoang cabin ba hàng ghế sang trọng và công nghệ tiện nghi cao cấp.',
    overview: [
      'Hyundai Palisade là mẫu SUV đầu bảng của Hyundai với thiết kế bề thế, mặt ca-lăng cỡ lớn và dải đèn dọc đặc trưng.',
      'Khoang cabin ba hàng ghế rộng rãi, vật liệu cao cấp cùng hàng loạt công nghệ tiện nghi và an toàn. Thông tin phiên bản và giá của thế hệ mới vui lòng liên hệ để được cập nhật.',
    ],
    imageAlt: 'Xe Hyundai Palisade thế hệ mới màu xanh rêu, góc nghiêng phía trước',
    seats: '7 chỗ',
    highlights: [
      { label: 'Phân khúc', value: 'SUV cỡ lớn' },
      { label: 'Dẫn động', value: 'HTRAC*' },
      { label: 'Số chỗ', value: '7 chỗ' },
      { label: 'An toàn', value: 'SmartSense' },
    ],
    features: [
      'Thiết kế bề thế, đèn LED dạng dọc',
      'Ba hàng ghế rộng rãi, vật liệu cao cấp',
      'Công nghệ tiện nghi và giải trí cao cấp',
      'Gói an toàn Hyundai SmartSense',
    ],
    versions: [{ name: 'Phiên bản mới', price: null }],
    featured: true,
    sourceUrl: `${OFFICIAL}/palisade`,
    seoKeywords: ['Hyundai Palisade', 'giá xe Palisade'],
  },
]

export const BODY_TYPE_LABEL: Record<BodyType, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  mpv: 'MPV',
  hatchback: 'Hatchback',
}

export const BODY_TYPE_FILTERS: { value: BodyType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'mpv', label: 'MPV' },
  { value: 'hatchback', label: 'Hatchback' },
]

export const getVehicle = (slug: string) => vehicles.find((v) => v.slug === slug)

export const getStartingPrice = (v: Vehicle): number | null => {
  const prices = v.versions.map((x) => x.price).filter((p): p is number => p != null)
  return prices.length ? Math.min(...prices) : null
}

export const featuredVehicles = () => vehicles.filter((v) => v.featured)

/** Mẫu xe dùng làm hero trang chủ */
export const HERO_VEHICLE_SLUG = 'creta'
