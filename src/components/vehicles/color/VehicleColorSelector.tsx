import { useRef, useState, type KeyboardEvent } from 'react'
import type { VehicleColor } from '@/types'
import { cn } from '@/utils/cn'
import { VehicleColorSwatch } from './VehicleColorSwatch'

/**
 * Bộ chọn màu ngoại thất dùng chung (card, trang chi tiết, form báo giá).
 * - radiogroup chuẩn ARIA: phím mũi tên / Home / End, roving tabindex.
 * - Nhiều màu hơn `maxVisible` -> nút "+N" ("Xem tất cả màu") để mở rộng.
 * - `onPreview`: gọi khi rê chuột / focus để tải trước ảnh màu đó (đổi ảnh tức thì).
 */
export function VehicleColorSelector({
  colors,
  value,
  onChange,
  onPreview,
  label,
  size = 'sm',
  maxVisible = 7,
  showName = true,
  className,
}: {
  colors: VehicleColor[]
  value?: string
  onChange: (id: string) => void
  onPreview?: (id: string) => void
  label: string
  size?: 'sm' | 'md'
  maxVisible?: number
  showName?: boolean
  className?: string
}) {
  const selectedIndex = colors.findIndex((c) => c.id === value)
  const [expanded, setExpanded] = useState(false)
  const open = expanded || colors.length <= maxVisible || selectedIndex >= maxVisible - 1
  const visible = open ? colors : colors.slice(0, maxVisible - 1)
  const hidden = colors.length - visible.length
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const current = colors[selectedIndex]

  const onKeyDown = (e: KeyboardEvent) => {
    const from = Math.max(0, selectedIndex)
    const last = colors.length - 1
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (from === last ? 0 : from + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (from === 0 ? last : from - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (next == null) return
    e.preventDefault()
    if (next >= visible.length) setExpanded(true)
    onChange(colors[next].id)
    requestAnimationFrame(() => refs.current[next]?.focus())
  }

  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn('flex flex-wrap items-center', size === 'md' ? 'gap-1 sm:gap-2' : 'gap-1')}
      >
        {visible.map((c, i) => (
          <VehicleColorSwatch
            key={c.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            color={c}
            size={size}
            selected={c.id === value}
            tabIndex={c.id === value || (selectedIndex < 0 && i === 0) ? 0 : -1}
            onClick={() => onChange(c.id)}
            onPointerEnter={() => onPreview?.(c.id)}
            onFocus={() => onPreview?.(c.id)}
          />
        ))}
        {hidden > 0 && (
          <button
            type="button"
            aria-expanded={false}
            aria-label={`Xem tất cả ${colors.length} màu`}
            onClick={() => setExpanded(true)}
            className={cn(
              'grid place-items-center rounded-full border border-line text-xs font-semibold text-muted transition-colors hover:border-ink/30 hover:text-ink',
              size === 'md' ? 'size-11' : 'size-8',
            )}
          >
            +{hidden}
          </button>
        )}
      </div>
      {showName && (
        <p className={cn('truncate text-muted', size === 'md' ? 'mt-3 text-[0.9375rem]' : 'mt-1.5 text-[0.8125rem]')} aria-live="polite">
          {current ? (
            <>
              <span className="font-semibold text-ink">{current.name}</span>
              {current.noImage && <span className="text-amber-700"> · chưa có ảnh</span>}
              <span> · {colors.length} màu</span>
            </>
          ) : (
            `${colors.length} màu ngoại thất · chọn để xem`
          )}
        </p>
      )}
    </div>
  )
}
