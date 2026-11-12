/**
 * Màu ngoại thất elantra – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'available',
  defaultColor: 'xanh-duong',
  sourceUrl: 'https://hyundai.thanhcong.vn/elantra',
  colors: [
    {
      id: 'do',
      name: 'Đỏ',
      hex: '#8c131c'
    },
    {
      id: 'xanh-duong',
      name: 'Xanh dương',
      hex: '#04366c'
    },
    {
      id: 'xam-kim-loai',
      name: 'Xám kim loại',
      hex: '#95928c'
    },
    {
      id: 'trang',
      name: 'Trắng',
      hex: '#e8e8e8'
    },
    {
      id: 'den',
      name: 'Đen',
      hex: '#0f0f0f'
    },
    {
      id: 'ghi-vang',
      name: 'Ghi vàng',
      hex: '#958d7e',
      noImage: true
    }
  ]
}
