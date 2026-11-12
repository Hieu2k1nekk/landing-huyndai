/**
 * Màu ngoại thất accent – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'available',
  defaultColor: 'bac',
  sourceUrl: 'https://hyundai.thanhcong.vn/all-new-accent',
  colors: [
    {
      id: 'bac',
      name: 'Bạc',
      hex: '#babdc1'
    },
    {
      id: 'do',
      name: 'Đỏ',
      hex: '#c23132'
    },
    {
      id: 'den',
      name: 'Đen',
      hex: '#111113'
    },
    {
      id: 'ghi-vang',
      name: 'Ghi vàng',
      hex: '#969082'
    },
    {
      id: 'xanh-duong',
      name: 'Xanh dương',
      hex: '#254374'
    },
    {
      id: 'vang-cat',
      name: 'Vàng cát',
      hex: '#9a8167'
    },
    {
      id: 'trang',
      name: 'Trắng',
      hex: '#efeeee'
    }
  ]
}
