import { siteConfig } from '@/config/site'
import { cn } from '@/utils/cn'

/**
 * Logo Hyundai dạng SVG (biểu tượng chữ H nghiêng trong hình elip).
 * Khi triển khai chính thức, thay bằng file logo trong bộ nhận diện
 * thương hiệu do nhà phân phối cung cấp cho đại lý.
 */
export function HyundaiMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="32" cy="20" rx="30" ry="17.5" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <path
        fill="currentColor"
        d="M17.6 29.6c2.2-4.6 4.6-9.3 7.2-13.9 1.3-2.3 3-4 5.2-5.1 1.3-.6 2.7-.9 4.2-1-.9 1.6-1.8 3.3-2.7 4.9 2.7.1 5.4-.4 7.9-1.4l.5-.2c-2.2 4.6-4.6 9.3-7.2 13.9-1.3 2.3-3 4-5.2 5.1-1.3.6-2.7.9-4.2 1 .9-1.6 1.8-3.3 2.7-4.9-2.7-.1-5.4.4-7.9 1.4l-.5.2Z"
      />
    </svg>
  )
}

export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', tone === 'dark' ? 'text-brand' : 'text-white', className)}>
      <HyundaiMark className="h-7 w-auto shrink-0 sm:h-8" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-bold tracking-[0.2em] sm:text-lg">HYUNDAI</span>{' '}
        <span
          className={cn(
            'mt-1 text-[0.625rem] font-medium tracking-[0.18em] uppercase',
            tone === 'dark' ? 'text-muted' : 'text-white/60',
          )}
        >
          {siteConfig.siteName.replace(/^Hyundai\s*/i, '') || 'Showroom'}
        </span>
      </span>
    </span>
  )
}
