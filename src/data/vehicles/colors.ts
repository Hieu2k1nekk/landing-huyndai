/**
 * Màu ngoại thất theo từng mẫu xe – mỗi mẫu một thư mục: src/data/vehicles/<slug>/colors.ts
 * (ảnh tương ứng: src/assets/images/cars/<slug>/colors/<colorId>.png).
 * Thêm/cập nhật màu: chạy `node scripts/fetch-vehicle-colors.mjs <slug>` rồi `npm run images`,
 * hoặc chỉnh tay file colors.ts của mẫu xe.
 */
import type { VehicleColor, VehicleColorConfig } from '@/types'
import { colors as grandI10 } from './grand-i10/colors'
import { colors as accent } from './accent/colors'
import { colors as elantra } from './elantra/colors'
import { colors as venue } from './venue/colors'
import { colors as creta } from './creta/colors'
import { colors as tucson } from './tucson/colors'
import { colors as santaFe } from './santa-fe/colors'
import { colors as stargazer } from './stargazer/colors'
import { colors as custin } from './custin/colors'
import { colors as palisade } from './palisade/colors'

const BY_SLUG: Record<string, VehicleColorConfig> = {
  'grand-i10': grandI10,
  accent,
  elantra,
  venue,
  creta,
  tucson,
  'santa-fe': santaFe,
  stargazer,
  custin,
  palisade,
}

const PENDING: VehicleColorConfig = { status: 'pending', colors: [] }

export const getColorConfig = (slug: string): VehicleColorConfig => BY_SLUG[slug] ?? PENDING

export const getVehicleColors = (slug: string): VehicleColor[] => getColorConfig(slug).colors

export const getDefaultColor = (slug: string): VehicleColor | undefined => {
  const conf = getColorConfig(slug)
  return conf.colors.find((c) => c.id === conf.defaultColor) ?? conf.colors.find((c) => !c.noImage)
}

/** Màu hợp lệ của mẫu xe (dùng khi đọc ?mau= hoặc trạng thái đã lưu) */
export const findColor = (slug: string, id?: string | null): VehicleColor | undefined =>
  id ? getVehicleColors(slug).find((c) => c.id === id) : undefined
