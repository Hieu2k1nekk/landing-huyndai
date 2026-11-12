import manifest from '@/data/generated/image-manifest.json'
import type { ResponsiveImage } from '@/types'

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

export const getCarImage = (slug: string, preferWidth = 960) => toSource(cars[slug], preferWidth)
export const getNewsImage = (key: string, preferWidth = 1280) => toSource(newsImgs[key], preferWidth)
