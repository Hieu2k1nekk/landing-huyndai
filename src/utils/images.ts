import manifest from '@/data/generated/image-manifest.json'
import type { ResponsiveImage } from '@/types'
import { getDefaultColor } from '@/data/vehicles/colors'

const cars = manifest.cars as Record<string, ResponsiveImage>
const newsImgs = manifest.news as Record<string, ResponsiveImage>

export interface ImageSource {
  src: string
  srcSet: string
  width: number
  height: number
}

function toSource(img: ResponsiveImage | undefined, preferWidth: number): ImageSource | null {
  if (!img) return null
  const sorted = [...img.variants].sort((a, b) => a.width - b.width)
  const main = sorted.find((v) => v.width >= preferWidth) ?? sorted.at(-1)!
  return {
    src: main.src,
    srcSet: sorted.map((v) => `${v.src} ${v.width}w`).join(', '),
    width: main.width,
    height: main.height,
  }
}

const colorImgs = ((manifest as { carColors?: unknown }).carColors ?? {}) as Record<string, Record<string, ResponsiveImage>>

/** Ảnh đúng màu (nếu có), không có thì trả null – KHÔNG thay bằng ảnh của màu khác */
export const getCarColorImage = (slug: string, colorId: string, preferWidth = 960) =>
  toSource(colorImgs[slug]?.[colorId], preferWidth)

/**
 * Ảnh đại diện mẫu xe: ưu tiên ảnh màu mặc định (cùng bộ ảnh với bộ chọn màu),
 * mẫu chưa có ảnh theo màu -> ảnh gốc source.png.
 */
export const getCarImage = (slug: string, preferWidth = 960) => {
  const def = getDefaultColor(slug)
  return (def && getCarColorImage(slug, def.id, preferWidth)) || toSource(cars[slug], preferWidth)
}
export const getNewsImage = (key: string, preferWidth = 1280) => toSource(newsImgs[key], preferWidth)

type Variant = { src: string; width: number; height: number }
const heroImgs = (manifest as { hero?: Record<string, { landscape: Variant[]; square: Variant[] }> }).hero ?? {}
const toSrcSet = (list: Variant[]) => list.map((v) => `${v.src} ${v.width}w`).join(', ')

/** Ảnh hero art-direction: `landscape` cho tablet/desktop, `square` (crop quanh xe) cho mobile */
export function getHeroImage(key: string) {
  const img = heroImgs[key]
  if (!img) return null
  const sq = img.square.at(0)!
  return {
    landscapeSrcSet: toSrcSet(img.landscape),
    squareSrcSet: toSrcSet(img.square),
    src: sq.src,
    width: sq.width,
    height: sq.height,
  }
}

/** Tải trước ảnh một màu (khi rê chuột / focus vào chấm màu) để đổi ảnh gần như tức thì */
const preloaded = new Set<string>()
export function preloadCarColor(slug: string, colorId: string, sizes: string) {
  if (typeof window === 'undefined') return
  const img = getCarColorImage(slug, colorId)
  if (!img || preloaded.has(img.srcSet + sizes)) return
  preloaded.add(img.srcSet + sizes)
  const el = new Image()
  el.sizes = sizes
  el.srcset = img.srcSet
  el.src = img.src
}
