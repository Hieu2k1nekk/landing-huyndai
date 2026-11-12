/**
 * Màu ngoại thất venue – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'available',
  defaultColor: 'xanh-duong',
  sourceUrl: 'https://hyundai.thanhcong.vn/san-pham/venue',
  colors: [
    {
      id: 'den',
      name: 'Đen',
      hex: '#000000'
    },
    {
      id: 'bac',
      name: 'Bạc',
      hex: '#e1e2e5'
    },
    {
      id: 'xam-kim-loai',
      name: 'Xám kim loại',
      hex: '#50555b'
    },
    {
      id: 'trang',
      name: 'Trắng',
      hex: '#eff4f5'
    },
    {
      id: 'do',
      name: 'Đỏ',
      hex: '#a21616'
    },
    {
      id: 'xanh-duong',
      name: 'Xanh dương',
      hex: '#151e3b'
    }
  ]
}
