import { forwardRef, type ButtonHTMLAttributes } from 'react'
import type { VehicleColor } from '@/types'
import { cn } from '@/utils/cn'

const SIZES = {
  sm: { outer: 'size-8', inner: 'size-[1.375rem]' },
  md: { outer: 'size-11', inner: 'size-8' },
} as const

/**
 * Nút màu dạng chấm tròn (role="radio" – nằm trong VehicleColorSelector).
 * Màu nền lấy từ mã swatch chính thức; lớp sáng nhẹ chỉ để chấm màu có chiều sâu,
 * KHÔNG tác động tới ảnh xe.
 */
export const VehicleColorSwatch = forwardRef<
  HTMLButtonElement,
  { color: VehicleColor; selected: boolean; size?: keyof typeof SIZES } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>
>(({ color, selected, size = 'sm', className, ...props }, ref) => {
  const s = SIZES[size]
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={color.noImage ? `${color.name} (chưa có ảnh)` : color.name}
      title={color.name}
      className={cn(
        'relative grid shrink-0 place-items-center rounded-full border-[1.5px] transition-[border-color,transform] duration-200 outline-none',
        'focus-visible:ring-4 focus-visible:ring-accent/30',
        selected ? 'border-brand' : 'border-transparent hover:border-ink/20',
        s.outer,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12),inset_0_-2px_4px_rgb(0_0_0/0.18)] transition-transform duration-200',
          selected ? 'scale-100' : 'scale-[0.92]',
          s.inner,
        )}
        style={{
          backgroundColor: color.hex,
          backgroundImage: 'radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.38), transparent 58%)',
        }}
      />
      {color.noImage && (
        <span aria-hidden className="absolute -top-0.5 -right-0.5 size-2 rounded-full border border-white bg-amber-500" />
      )}
    </button>
  )
})
VehicleColorSwatch.displayName = 'VehicleColorSwatch'
