import type { Promotion } from '@/types'

/**
 * CHƯƠNG TRÌNH ƯU ĐÃI
 * ---------------------------------------------------------------------------
 * ⚠ DỮ LIỆU MẪU. Website KHÔNG tự tạo chương trình khuyến mãi có giá trị cụ thể.
 *   Khi có chương trình thật: điền `value`, `validUntil`, `appliesTo` và
 *   đặt `isSample: false` để gỡ nhãn "Cần cập nhật".
 */
export const promotions: Promotion[] = [
  {
    id: 'uu-dai-gia-ban',
    icon: 'tag',
    title: 'Ưu đãi giá bán',
    description:
      'Chương trình giảm giá tiền mặt áp dụng cho các phiên bản theo từng thời điểm. Liên hệ để nhận mức ưu đãi hiện hành.',
    isSample: true,
  },
  {
    id: 'ho-tro-truoc-ba',
    icon: 'receipt',
    title: 'Hỗ trợ lệ phí trước bạ',
    description:
      'Hỗ trợ một phần hoặc toàn bộ lệ phí trước bạ khi chương trình được áp dụng, giúp giảm chi phí lăn bánh.',
    isSample: true,
  },
  {
    id: 'ho-tro-tra-gop',
    icon: 'wallet',
    title: 'Hỗ trợ trả góp',
    description:
      'Tư vấn phương án vay mua xe cùng các ngân hàng liên kết: thủ tục nhanh, lịch trả nợ rõ ràng, phù hợp thu nhập.',
    isSample: true,
  },
  {
    id: 'qua-tang-phu-kien',
    icon: 'gift',
    title: 'Quà tặng phụ kiện',
    description:
      'Gói phụ kiện chính hãng đi kèm theo chương trình: phim cách nhiệt, thảm sàn, camera hành trình…',
    isSample: true,
  },
  {
    id: 'uu-dai-theo-dong-xe',
    icon: 'car',
    title: 'Ưu đãi theo từng dòng xe',
    description:
      'Mỗi dòng xe có chính sách bán hàng riêng trong tháng. Chọn mẫu xe quan tâm để nhận thông tin ưu đãi chi tiết.',
    appliesTo: ['accent', 'creta', 'tucson', 'santa-fe', 'custin'],
    isSample: true,
  },
]
