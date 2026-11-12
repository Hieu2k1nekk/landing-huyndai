/**
 * Màu ngoại thất creta – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'available',
  defaultColor: 'do',
  sourceUrl: 'https://hyundai.thanhcong.vn/san-pham/new-creta',
  colors: [
    {
      id: 'trang',
      name: 'Trắng',
      hex: '#f5f5f5'
    },
    {
      id: 'do',
      name: 'Đỏ',
      hex: '#cd1c1d'
    },
    {
      id: 'den',
      name: 'Đen',
      hex: '#0f0c10'
    },
    {
      id: 'xam-kim-loai',
      name: 'Xám kim loại',
      hex: '#626060'
    },
    {
      id: 'bac',
      name: 'Bạc',
      hex: '#c5c7c9'
    },
    {
      id: 'xanh-duong',
      name: 'Xanh dương',
      hex: '#003a74'
    }
  ]
}
