import { pricing } from '@/config/site'
import { cn } from '@/utils/cn'

/** Chú thích dấu * cho giá tham khảo (ẩn khi giá đã được xác minh) */
export function PriceNote({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <p className={cn('text-sm', tone === 'light' ? 'text-white/55' : 'text-muted', className)}>
      {!pricing.verified && <span aria-hidden>* </span>}
      {pricing.disclaimer}
      {pricing.verified && pricing.reviewedAt && ` Cập nhật: ${pricing.reviewedAt.split('-').reverse().join('/')}.`}
    </p>
  )
}
