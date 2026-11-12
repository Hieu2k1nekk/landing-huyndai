import { getCarImage } from '@/utils/images'
import { cn } from '@/utils/cn'

/**
 * Ảnh xe đã tách nền (WebP có alpha) với srcset/sizes + width/height chống CLS.
 * `priority` dành cho ảnh LCP (hero): eager + fetchpriority=high, không lazy.
 */
export function CarImage({
  slug,
  alt,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
  className,
}: {
  slug: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const img = getCarImage(slug)
  if (!img) return <div className={cn('aspect-[2/1] w-full', className)} aria-hidden />
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('h-auto w-full object-contain', className)}
    />
  )
}
