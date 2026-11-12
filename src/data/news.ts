import type { NewsArticle, NewsCategory } from '@/types'

/**
 * BÀI VIẾT
 * Nội dung mang tính kiến thức chung. Có thể thay bằng dữ liệu từ CMS
 * (giữ nguyên interface NewsArticle). Ảnh: public/images/news/<image>-<w>.webp
 */

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  'tin-tuc': 'Tin tức Hyundai',
  'kinh-nghiem-mua-xe': 'Kinh nghiệm mua xe',
  'so-sanh': 'So sánh xe',
  'huong-dan-su-dung': 'Hướng dẫn sử dụng',
  'kinh-nghiem-lai-xe': 'Kinh nghiệm lái xe',
}

export const news: NewsArticle[] = [
  {
    slug: 'chi-phi-lan-banh-o-to-gom-nhung-khoan-nao',
    title: 'Chi phí lăn bánh ô tô gồm những khoản nào?',
    excerpt:
      'Ngoài giá niêm yết, người mua cần chuẩn bị thêm lệ phí trước bạ, phí biển số, đăng kiểm, bảo hiểm… Cùng tìm hiểu từng khoản để dự trù ngân sách chính xác.',
    category: 'kinh-nghiem-mua-xe',
    image: 'tucson-hev-ext2',
    imageAlt: 'Hyundai Tucson Hybrid màu đỏ đỗ bên đường, nhìn ngang thân xe',
    publishedAt: '2026-11-05',
    readingMinutes: 5,
    relatedVehicles: ['tucson', 'creta', 'accent'],
    body: [
      { type: 'p', text: 'Giá niêm yết chỉ là một phần trong tổng số tiền cần chuẩn bị khi mua ô tô. Để xe có thể lưu thông hợp pháp, người mua cần hoàn tất một số khoản phí bắt buộc – thường được gọi chung là chi phí lăn bánh.' },
      { type: 'h2', text: 'Các khoản phí bắt buộc' },
      { type: 'ul', items: [
        'Lệ phí trước bạ: tính theo phần trăm giá tính lệ phí trước bạ, với ô tô con lần đầu đăng ký thường dao động từ 10% đến 12% tùy địa phương.',
        'Phí đăng ký và cấp biển số: mức thu khác nhau giữa các khu vực, cao hơn tại các thành phố lớn.',
        'Phí đăng kiểm và phí bảo trì đường bộ.',
        'Bảo hiểm trách nhiệm dân sự bắt buộc.',
      ] },
      { type: 'h2', text: 'Các khoản nên cân nhắc' },
      { type: 'p', text: 'Bảo hiểm vật chất thân vỏ, phụ kiện (phim cách nhiệt, camera hành trình, thảm sàn) không bắt buộc nhưng giúp bảo vệ xe và nâng cao trải nghiệm sử dụng.' },
      { type: 'p', text: 'Mức phí cụ thể thay đổi theo địa phương và theo quy định hiện hành. Hãy để lại thông tin để được tư vấn bảng tính lăn bánh chi tiết cho mẫu xe và tỉnh/thành bạn đăng ký.' },
    ],
  },
  {
    slug: 'nen-chon-hyundai-creta-hay-tucson',
    title: 'Nên chọn Hyundai Creta hay Tucson?',
    excerpt:
      'Hai mẫu SUV ăn khách của Hyundai thuộc hai phân khúc khác nhau. Bài viết giúp bạn so sánh kích thước, nhu cầu sử dụng và ngân sách để chọn đúng xe.',
    category: 'so-sanh',
    image: 'tucson-hev-1',
    imageAlt: 'Hyundai Tucson Hybrid màu đỏ đỗ trước khu nghỉ dưỡng, góc nhìn từ trên cao',
    publishedAt: '2026-10-28',
    readingMinutes: 6,
    relatedVehicles: ['creta', 'tucson'],
    body: [
      { type: 'p', text: 'Hyundai Creta (SUV hạng B) và Hyundai Tucson (SUV hạng C) đều là những lựa chọn phổ biến của gia đình Việt. Sự khác biệt chính nằm ở kích thước, trang bị và tầm giá.' },
      { type: 'h2', text: 'Kích thước và không gian' },
      { type: 'p', text: 'Tucson có kích thước tổng thể lớn hơn, hàng ghế sau và khoang hành lý rộng rãi hơn – phù hợp gia đình thường xuyên đi xa. Creta gọn gàng hơn, dễ xoay trở và đỗ xe trong đô thị.' },
      { type: 'h2', text: 'Động cơ và vận hành' },
      { type: 'p', text: 'Creta sử dụng động cơ xăng 1.5L kết hợp hộp số vô cấp, ưu tiên sự êm ái và tiết kiệm. Tucson có nhiều lựa chọn hơn gồm xăng, dầu và tăng áp, kèm hệ dẫn động HTRAC trên một số phiên bản.' },
      { type: 'h2', text: 'Gợi ý lựa chọn' },
      { type: 'ul', items: [
        'Chủ yếu đi trong phố, ngân sách tối ưu: cân nhắc Creta.',
        'Gia đình 4–5 người, hay đi đường dài, cần nhiều trang bị: cân nhắc Tucson.',
        'Hãy lái thử cả hai mẫu xe để cảm nhận trực tiếp trước khi quyết định.',
      ] },
    ],
  },
  {
    slug: 'mua-xe-tra-gop-can-chuan-bi-gi',
    title: 'Mua xe trả góp: 5 điều cần chuẩn bị',
    excerpt:
      'Trả góp giúp sở hữu xe sớm hơn nhưng cần tính toán kỹ khoản trả trước, kỳ hạn và lãi suất. Đây là checklist trước khi ký hợp đồng vay.',
    category: 'kinh-nghiem-mua-xe',
    image: 'palisade-8524',
    imageAlt: 'Nội thất Hyundai Palisade với ghế da màu đỏ đô và vô-lăng bốn chấu',
    publishedAt: '2026-10-20',
    readingMinutes: 4,
    relatedVehicles: ['accent', 'creta', 'custin'],
    body: [
      { type: 'p', text: 'Vay mua ô tô là lựa chọn phổ biến giúp bạn sở hữu xe mà không cần chi trả toàn bộ một lần. Tuy nhiên, chuẩn bị kỹ sẽ giúp bạn tránh áp lực tài chính về sau.' },
      { type: 'ul', items: [
        'Xác định khoản trả trước: ngoài phần đối ứng, nhớ cộng thêm chi phí lăn bánh.',
        'Chọn kỳ hạn phù hợp: kỳ hạn dài giúp giảm số tiền trả hằng tháng nhưng tổng lãi cao hơn.',
        'Tìm hiểu kỹ lãi suất: phân biệt lãi suất ưu đãi ban đầu và lãi suất thả nổi sau đó.',
        'Chuẩn bị hồ sơ: giấy tờ tùy thân, chứng minh thu nhập, nơi cư trú.',
        'Đọc kỹ điều khoản tất toán trước hạn và các loại phí liên quan.',
      ] },
      { type: 'p', text: 'Đội ngũ tư vấn có thể giúp bạn lập bảng dự tính khoản trả hằng tháng theo từng mẫu xe và phương án vay.' },
    ],
  },
  {
    slug: 'huong-dan-su-dung-man-hinh-hud',
    title: 'Hướng dẫn tùy chỉnh màn hình HUD trên xe Hyundai',
    excerpt:
      'Màn hình hiển thị trên kính lái (HUD) giúp người lái theo dõi thông tin mà không phải rời mắt khỏi đường. Cách điều chỉnh để hiển thị rõ và thoải mái nhất.',
    category: 'huong-dan-su-dung',
    image: 'palisade-8485',
    imageAlt: 'Màn hình giải trí trung tâm xe Hyundai hiển thị menu cài đặt Head-Up Display',
    publishedAt: '2026-10-12',
    readingMinutes: 3,
    relatedVehicles: ['palisade', 'santa-fe'],
    body: [
      { type: 'p', text: 'Trên các phiên bản được trang bị, màn hình HUD hiển thị tốc độ, chỉ dẫn đường và cảnh báo an toàn ngay trong tầm mắt người lái.' },
      { type: 'h2', text: 'Các bước tùy chỉnh cơ bản' },
      { type: 'ul', items: [
        'Vào phần Cài đặt trên màn hình trung tâm, chọn mục Head-Up Display.',
        'Bật hiển thị và điều chỉnh chiều cao, góc xoay sao cho hình ảnh nằm trong tầm nhìn tự nhiên.',
        'Chọn nội dung hiển thị phù hợp để tránh rối mắt.',
        'Nếu xe có nhớ vị trí ghế, có thể đồng bộ thiết lập HUD theo từng người lái.',
      ] },
      { type: 'p', text: 'Tên mục và vị trí cài đặt có thể khác nhau tùy mẫu xe và phiên bản phần mềm. Luôn tham khảo sách hướng dẫn sử dụng đi kèm xe.' },
    ],
  },
  {
    slug: 'kinh-nghiem-lai-xe-duong-deo-an-toan',
    title: 'Kinh nghiệm lái xe đường đèo an toàn',
    excerpt:
      'Đường đèo dốc, cua gấp đòi hỏi kỹ năng sử dụng phanh, số và quan sát tốt. Những lưu ý giúp chuyến đi của bạn an toàn hơn.',
    category: 'kinh-nghiem-lai-xe',
    image: 'palisade-0056',
    imageAlt: 'Hyundai Palisade màu trắng di chuyển trên cung đường đèo ven núi',
    publishedAt: '2026-10-03',
    readingMinutes: 5,
    relatedVehicles: ['palisade', 'santa-fe', 'tucson'],
    body: [
      { type: 'p', text: 'Lái xe đường đèo là trải nghiệm thú vị nhưng cũng tiềm ẩn nhiều rủi ro nếu chủ quan. Dưới đây là những kinh nghiệm cơ bản bạn nên ghi nhớ.' },
      { type: 'h2', text: 'Khi lên dốc' },
      { type: 'ul', items: [
        'Giữ khoảng cách an toàn với xe phía trước, hạn chế vượt ở khúc cua.',
        'Sử dụng chế độ số phù hợp để duy trì lực kéo ổn định.',
      ] },
      { type: 'h2', text: 'Khi xuống dốc' },
      { type: 'ul', items: [
        'Ưu tiên phanh động cơ bằng cách về số thấp, tránh rà phanh liên tục gây nóng phanh.',
        'Giảm tốc trước khi vào cua, không phanh gấp giữa cua.',
        'Đi đúng làn, bấm còi hoặc nháy đèn ở những khúc cua khuất tầm nhìn.',
      ] },
      { type: 'p', text: 'Trước chuyến đi, hãy kiểm tra phanh, lốp và đèn – hoặc đặt lịch kiểm tra xe tại xưởng dịch vụ.' },
    ],
  },
  {
    slug: 'xe-hybrid-hoat-dong-nhu-the-nao',
    title: 'Xe hybrid hoạt động như thế nào?',
    excerpt:
      'Hybrid kết hợp động cơ xăng và mô-tơ điện để tiết kiệm nhiên liệu, vận hành êm. Tìm hiểu nguyên lý và ai nên chọn xe hybrid.',
    category: 'tin-tuc',
    image: 'tucson-hev-run1',
    imageAlt: 'Hyundai Tucson Hybrid màu đỏ chạy trên đường phố hàng cọ',
    publishedAt: '2026-09-25',
    readingMinutes: 4,
    relatedVehicles: ['tucson', 'santa-fe'],
    body: [
      { type: 'p', text: 'Xe hybrid (HEV) sử dụng đồng thời động cơ đốt trong và mô-tơ điện. Hệ thống tự động chuyển đổi hoặc phối hợp hai nguồn động lực tùy điều kiện vận hành.' },
      { type: 'h2', text: 'Nguyên lý cơ bản' },
      { type: 'ul', items: [
        'Khi khởi hành và di chuyển chậm, mô-tơ điện có thể hỗ trợ hoặc vận hành độc lập giúp xe êm và tiết kiệm.',
        'Khi tăng tốc, động cơ xăng và mô-tơ điện cùng làm việc để tăng sức kéo.',
        'Khi giảm tốc, năng lượng được thu hồi để sạc lại pin – không cần cắm sạc ngoài.',
      ] },
      { type: 'h2', text: 'Ai nên chọn xe hybrid?' },
      { type: 'p', text: 'Xe hybrid phù hợp với người thường xuyên di chuyển trong đô thị, muốn tối ưu chi phí nhiên liệu nhưng chưa sẵn sàng chuyển sang xe điện hoàn toàn.' },
    ],
  },
]

export const getArticle = (slug: string) => news.find((a) => a.slug === slug)

export const sortedNews = () =>
  [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
