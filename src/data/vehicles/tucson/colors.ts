/**
 * Màu ngoại thất tucson – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'available',
  defaultColor: 'do-do',
  sourceUrl: 'https://hyundai.thanhcong.vn/san-pham/tucson',
  colors: [
    {
      id: 'xanh-luc-bao',
      name: 'Xanh lục bảo',
      hex: '#0c371e'
    },
    {
      id: 'vang-cat',
      name: 'Vàng cát',
      hex: '#9d8067'
    },
    {
      id: 'xanh-duong',
      name: 'Xanh dương',
      hex: '#0f4173'
    },
    {
      id: 'trang',
      name: 'Trắng',
      hex: '#f0f0f1'
    },
    {
      id: 'bac',
      name: 'Bạc',
      hex: '#babdc1'
    },
    {
      id: 'den',
      name: 'Đen',
      hex: '#0d0e0f'
    },
    {
      id: 'do-do',
      name: 'Đỏ đô',
      hex: '#831c1b'
    }
  ]
}
