import { pricing } from '@/config/site'
import { formatPriceShort } from '@/utils/format'
import { cn } from '@/utils/cn'

const SIZES = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl sm:text-[1.75rem]',
} as const

/**
 * Giá khởi điểm thống nhất toàn site.
 * - Chưa xác minh giá: nhãn "tham khảo" + dấu * (chú thích ở PriceNote).
 * - Không có giá: "Liên hệ" – không tự tạo con số.
 */
export function PriceTag({
  price,
  tone = 'dark',
  size = 'md',
  className,
}: {
  price: number | null
  tone?: 'dark' | 'light'
  size?: keyof typeof SIZES
  className?: string
}) {
  const light = tone === 'light'
  return (
    <div className={className}>
      <p className={cn('text-xs font-medium', light ? 'text-white/60' : 'text-muted')}>
        {price == null ? 'Giá bán' : `Giá ${pricing.verified ? 'niêm yết' : 'tham khảo'} từ`}
      </p>
      <p
        className={cn(
          'mt-0.5 leading-tight font-bold tracking-tight tabular-nums',
          SIZES[size],
          light ? 'text-white' : 'text-brand',
        )}
      >
        {formatPriceShort(price)}
        {price != null && !pricing.verified && (
          <span className={cn('ml-0.5 align-super text-[0.6em]', light ? 'text-white/60' : 'text-muted')}>*</span>
        )}
      </p>
    </div>
  )
}
