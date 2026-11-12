/**
 * Màu ngoại thất santa-fe – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'available',
  defaultColor: 'trang',
  sourceUrl: 'https://hyundai.thanhcong.vn/san-pham/santa-fe',
  colors: [
    {
      id: 'xanh-duong',
      name: 'Xanh dương',
      hex: '#104174'
    },
    {
      id: 'vang-cat',
      name: 'Vàng cát',
      hex: '#9d7f66'
    },
    {
      id: 'do-do',
      name: 'Đỏ đô',
      hex: '#861b1e'
    },
    {
      id: 'trang',
      name: 'Trắng',
      hex: '#eff0f0'
    },
    {
      id: 'den',
      name: 'Đen',
      hex: '#0b0b0d'
    },
    {
      id: 'bac',
      name: 'Bạc',
      hex: '#b9bdc0'
    },
    {
      id: 'xanh-luc-bao',
      name: 'Xanh lục bảo',
      hex: '#07331a'
    }
  ]
}
