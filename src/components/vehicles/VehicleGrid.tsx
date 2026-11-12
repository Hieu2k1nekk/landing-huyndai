import { useMemo, useState } from 'react'
import type { BodyType } from '@/types'
import { BODY_TYPE_FILTERS, vehicles } from '@/data/vehicles'
import { VehicleCard } from './VehicleCard'
import { cn } from '@/utils/cn'

type Filter = BodyType | 'all'

/**
 * Lưới xe + bộ lọc kiểu dáng.
 * Mặc định "Tất cả" -> toàn bộ xe có trong HTML prerender (tốt cho SEO).
 */
export function VehicleGrid({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: vehicles.length }
    for (const v of vehicles) c[v.bodyType] = (c[v.bodyType] ?? 0) + 1
    return c
  }, [])

  const list = filter === 'all' ? vehicles : vehicles.filter((v) => v.bodyType === filter)

  return (
    <div>
      <div
        role="toolbar"
        aria-label="Lọc theo kiểu dáng xe"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0"
      >
        {BODY_TYPE_FILTERS.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.value)}
              className={cn(
                'inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors',
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-white text-ink/80 hover:border-brand/40 hover:text-brand',
              )}
            >
              {f.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-surface text-muted',
                )}
              >
                {counts[f.value] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Đang hiển thị {list.length} dòng xe
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
        {list.map((v) => (
          <li key={v.slug} className="animate-[fade-up_0.45s_var(--ease-out-soft)_both]">
            <VehicleCard vehicle={v} headingLevel={headingLevel} />
          </li>
        ))}
      </ul>
    </div>
  )
}
