import { getNewsImage } from '@/utils/images'
import { cn } from '@/utils/cn'

export function NewsImage({
  image,
  alt,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
  className,
}: {
  image: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const img = getNewsImage(image)
  if (!img) return null
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
