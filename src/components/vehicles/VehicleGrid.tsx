import { useEffect, useMemo, useRef, useState } from 'react'
import type { BodyType } from '@/types'
import { BODY_TYPE_FILTERS, vehicles } from '@/data/vehicles'
import { VehicleCard } from './VehicleCard'
import { cn } from '@/utils/cn'

type Filter = BodyType | 'all'

/** Thứ tự ưu tiên khi chọn "Tất cả"; các xe còn lại giữ nguyên thứ tự gốc, xếp sau */
const PRIORITY = ['palisade', 'santa-fe', 'tucson', 'creta', 'accent']
const rank = (slug: string) => {
  const i = PRIORITY.indexOf(slug)
  return i === -1 ? PRIORITY.length : i
}
const sortedAll = [...vehicles].sort((a, b) => rank(a.slug) - rank(b.slug))

/**
 * Lưới xe + bộ lọc kiểu dáng dạng segmented control (nền trượt theo lựa chọn).
 * Mặc định "Tất cả" -> toàn bộ xe có trong HTML prerender (tốt cho SEO).
 */
export function VehicleGrid({
  headingLevel = 'h3',
  compactMobile = false,
}: {
  headingLevel?: 'h2' | 'h3'
  /** Mobile: 2 xe/hàng, thẻ rút gọn (ảnh, tên, giá) */
  compactMobile?: boolean
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const trackRef = useRef<HTMLDivElement>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: vehicles.length }
    for (const v of vehicles) c[v.bodyType] = (c[v.bodyType] ?? 0) + 1
    return c
  }, [])

  const list = filter === 'all' ? sortedAll : vehicles.filter((v) => v.bodyType === filter)

  // Đo vị trí nút đang chọn để đặt nền trượt (chỉ chạy phía client)
  useEffect(() => {
    const measure = () => {
      const el = btnRefs.current[filter]
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [filter])

  return (
    <div>
      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <div
          ref={trackRef}
          role="toolbar"
          aria-label="Lọc theo kiểu dáng xe"
          className="relative inline-flex gap-1 rounded-full bg-surface p-1.5"
        >
          {indicator && (
            <span
              aria-hidden
              className="absolute top-1.5 bottom-1.5 rounded-full bg-brand shadow-[var(--shadow-soft)] transition-[left,width] duration-400 ease-[var(--ease-out-soft)]"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {BODY_TYPE_FILTERS.map((f) => {
            const active = filter === f.value
            return (
              <button
                key={f.value}
                ref={(el) => {
                  btnRefs.current[f.value] = el
                }}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'relative z-[1] inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-300',
                  active ? 'text-white' : 'text-ink/70 hover:text-brand',
                  // Trước khi đo được (HTML prerender) -> tô nền trực tiếp trên nút
                  active && !indicator && 'bg-brand',
                )}
              >
                {f.label}
                <span className={cn('text-xs tabular-nums', active ? 'text-white/65' : 'text-muted')}>
                  {counts[f.value] ?? 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Đang hiển thị {list.length} dòng xe
      </p>

      <ul
        className={cn(
          'mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-7',
          compactMobile && 'max-sm:grid-cols-2 max-sm:gap-3',
        )}
      >
        {list.map((v, i) => (
          <li
            key={`${filter}-${v.slug}`}
            className="animate-[fade-up_0.55s_var(--ease-out-soft)_both]"
            style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
          >
            <VehicleCard vehicle={v} headingLevel={headingLevel} compactMobile={compactMobile} />
          </li>
        ))}
      </ul>
    </div>
  )
}
