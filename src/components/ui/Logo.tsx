import { siteConfig } from '@/config/site'
import { cn } from '@/utils/cn'

/** Logo đại lý (wordmark ngang, tỉ lệ 1366 × 96), file trong /public */
const LOGO = {
  blue: '/hyundai-tc-motor-blue.svg',
  black: '/hyundai-tc-motor-black.svg',
} as const

/**
 * - `dark`  (nền sáng): logo xanh.
 * - `light` (nền tối – header trong suốt trên hero, footer): logo đen được đảo sang trắng bằng CSS filter
 *   để luôn đủ tương phản; không dùng bản màu đè lên nền xanh đậm.
 * - `mono`  (nền sáng, cần trung tính): logo đen.
 */
export function Logo({
  className,
  tone = 'dark',
}: {
  className?: string
  tone?: 'dark' | 'light' | 'mono'
}) {
  return (
    <img
      src={tone === 'dark' ? LOGO.blue : LOGO.black}
      alt={siteConfig.siteName}
      width={1366}
      height={96}
      decoding="async"
      draggable={false}
      className={cn(
        'block h-[18px] w-auto max-w-full select-none sm:h-5 lg:h-4 xl:h-[22px]',
        tone === 'light' && 'brightness-0 invert',
        className,
      )}
    />
  )
}
