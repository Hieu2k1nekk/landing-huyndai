/**
 * Màu ngoại thất palisade – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'pending',
  note: 'Bộ ảnh màu trên website chính thức là thế hệ trước – chờ ảnh màu của Palisade thế hệ mới.',
  sourceUrl: 'https://hyundai.thanhcong.vn/palisade',
  colors: []
}
