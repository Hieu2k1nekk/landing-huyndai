/**
 * Màu ngoại thất stargazer – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.
 * Nguồn: https://hyundai.thanhcong.vn (mục Ngoại thất – ảnh 360° theo từng màu).
 * `versions`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.
 */
import type { VehicleColorConfig } from '@/types'

export const colors: VehicleColorConfig = {
  status: 'available',
  defaultColor: 'do',
  sourceUrl: 'https://hyundai.thanhcong.vn/stargazer',
  colors: [
    {
      id: 'xam',
      name: 'Xám',
      hex: '#5f5e5b'
    },
    {
      id: 'bac',
      name: 'Bạc',
      hex: '#8b8b8b'
    },
    {
      id: 'trang',
      name: 'Trắng',
      hex: '#ced1d4'
    },
    {
      id: 'den',
      name: 'Đen',
      hex: '#383838'
    },
    {
      id: 'do',
      name: 'Đỏ',
      hex: '#843636'
    }
  ]
}
