import { useState } from 'react'
import type { VehicleColor } from '@/types'
import { getCarColorImage, getCarImage, type ImageSource } from '@/utils/images'
import { getDefaultColor } from '@/data/vehicles/colors'
import { cn } from '@/utils/cn'

interface Layer {
  key: string
  img: ImageSource
  alt: string
  shown: boolean
}

/** Ảnh hiển thị cho 1 màu: đúng ảnh màu đó, hoặc (màu chưa có ảnh / mẫu chưa có dữ liệu màu) ảnh gốc của mẫu xe */
function resolve(slug: string, name: string, color?: VehicleColor) {
  const exact = color && !color.noImage ? getCarColorImage(slug, color.id) : null
  if (exact && color) return { key: color.id, img: exact, alt: `${name} màu ${color.name}, góc 3/4 phía trước`, exact: true }
  const def = getDefaultColor(slug)
  const img = getCarImage(slug)
  return {
    key: '__base',
    img,
    alt: def ? `${name} màu ${def.name}, góc 3/4 phía trước` : `${name}, góc 3/4 phía trước`,
    exact: !color,
  }
}

/**
 * Ảnh xe theo màu đang chọn.
 * - Khung cố định aspect 2:1 -> đổi màu không làm thay đổi kích thước card (không CLS).
 * - Mỗi lần đổi màu thêm 1 lớp ảnh mới (opacity 0), ảnh tải xong mới hiện dần đè lên ảnh cũ,
 *   sau đó gỡ lớp cũ -> không nháy trắng, không reload.
 * - Màu chưa có ảnh chính xác: giữ ảnh gốc + nhãn "Chưa có ảnh màu …" (không giả lập màu).
 */
export function VehicleImagePreview({
  slug,
  name,
  color,
  sizes,
  priority = false,
  className,
  imgClassName,
}: {
  slug: string
  name: string
  color?: VehicleColor
  sizes: string
  priority?: boolean
  className?: string
  imgClassName?: string
}) {
  const target = resolve(slug, name, color)
  const [layers, setLayers] = useState<Layer[]>(() =>
    target.img ? [{ key: target.key, img: target.img, alt: target.alt, shown: true }] : [],
  )

  // Đồng bộ lớp trên cùng với màu đang chọn (cập nhật trong render – mẫu "adjust state on prop change")
  const top = layers.at(-1)
  if (target.img && (top?.key !== target.key || top.alt !== target.alt)) {
    const keep = layers.filter((l) => l.key !== target.key && l.shown)
    setLayers([...keep, { key: target.key, img: target.img, alt: target.alt, shown: keep.length === 0 }])
  }

  const reveal = (key: string) =>
    setLayers((ls) => (ls.at(-1)?.key === key && !ls.at(-1)!.shown ? ls.map((l) => (l.key === key ? { ...l, shown: true } : l)) : ls))
  const settle = (key: string) =>
    setLayers((ls) => (ls.at(-1)?.key === key && ls.length > 1 ? ls.slice(-1) : ls))

  const missing = color?.noImage

  return (
    <div className={cn('relative aspect-[2/1] w-full', className)}>
      {layers.map((l, i) => {
        const isTop = i === layers.length - 1
        return (
          <img
            key={l.key}
            src={l.img.src}
            srcSet={l.img.srcSet}
            sizes={sizes}
            width={l.img.width}
            height={l.img.height}
            alt={isTop ? l.alt : ''}
            aria-hidden={isTop ? undefined : true}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority && i === 0 ? 'high' : 'auto'}
            ref={(el) => {
              if (el && isTop && !l.shown && el.complete && el.naturalWidth) requestAnimationFrame(() => reveal(l.key))
            }}
            onLoad={() => isTop && reveal(l.key)}
            onError={() => isTop && reveal(l.key)}
            onTransitionEnd={(e) => e.propertyName === 'opacity' && isTop && settle(l.key)}
            className={cn(
              'color-layer absolute inset-0 size-full object-contain',
              l.shown ? 'opacity-100' : 'opacity-0',
              imgClassName,
            )}
          />
        )
      })}
      {missing && color && (
        <span className="absolute top-0 right-0 z-[2] rounded-full bg-white/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200">
          Chưa có ảnh màu {color.name}
        </span>
      )}
    </div>
  )
}
