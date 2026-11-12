/**
 * Màu ngoại thất grand-i10 – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'pending',
  note: 'Website chính thức chưa công bố bộ ảnh theo từng màu.',
  sourceUrl: 'https://hyundai.thanhcong.vn/new-grand-i10',
  colors: []
}
