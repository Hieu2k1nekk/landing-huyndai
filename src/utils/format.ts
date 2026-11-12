/** 360000000 -> "360 triệu"; 1069000000 -> "1,069 tỷ" */
export function formatPriceShort(value: number | null): string {
  if (value == null) return 'Liên hệ'
  if (value >= 1_000_000_000) {
    const ty = value / 1_000_000_000
    return `${ty.toLocaleString('vi-VN', { maximumFractionDigits: 3 })} tỷ`
  }
  return `${Math.round(value / 1_000_000).toLocaleString('vi-VN')} triệu`
}

/** 1069000000 -> "1.069.000.000 ₫" */
export function formatPriceFull(value: number | null): string {
  if (value == null) return 'Liên hệ'
  return `${value.toLocaleString('vi-VN')} ₫`
}

/** "2026-11-05" -> "05/11/2026" (không phụ thuộc timezone) */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}
