import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { featuredVehicles, getStartingPrice } from '@/data/vehicles'
import { cn } from '@/utils/cn'
import { CarImage } from '@/components/ui/CarImage'
import { ButtonLink } from '@/components/ui/Button'
import { PriceTag } from '@/components/ui/PriceTag'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { QuoteLink } from '@/components/forms/QuoteLink'

/**
 * "Spotlight" mẫu xe nổi bật: tab chọn mẫu + sân khấu lớn + thông số.
 * Mọi panel đều có trong HTML prerender (panel ẩn dùng thuộc tính hidden) để giữ nội dung cho SEO.
 */
export function FeaturedVehicles() {
  const list = featuredVehicles().slice(0, 3)
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const uid = useId()

  const onKeyDown = (e: KeyboardEvent) => {
    const last = list.length - 1
    const next =
      e.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : e.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (next == null) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section aria-labelledby="featured-title" className="section-y bg-surface">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="featured-title"
            eyebrow="Mẫu xe nổi bật"
            title="SUV cho mọi hành trình gia đình"
            description="Từ đô thị đến những chuyến đi dài – những mẫu SUV được nhiều gia đình Việt lựa chọn."
          />
          <div
            role="tablist"
            aria-label="Chọn mẫu xe nổi bật"
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-5 flex shrink-0 gap-6 overflow-x-auto border-b border-ink/10 px-5 md:mx-0 md:px-0 lg:gap-8"
          >
            {list.map((v, i) => {
              const selected = i === active
              return (
                <button
                  key={v.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-controls={`${uid}-panel-${i}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    'relative shrink-0 pb-4 text-lg font-bold tracking-tight whitespace-nowrap transition-colors sm:text-xl',
                    'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:bg-brand after:transition-transform after:duration-300',
                    selected ? 'text-brand after:scale-x-100' : 'text-ink/40 after:scale-x-0 hover:text-ink/70',
                  )}
                >
                  {v.model}
                </button>
              )
            })}
          </div>
        </div>

        {list.map((v, i) => (
          <article
            key={v.slug}
            role="tabpanel"
            id={`${uid}-panel-${i}`}
            aria-labelledby={`${uid}-tab-${i}`}
            hidden={i !== active}
            className="mt-10 grid animate-[fade-up_0.6s_var(--ease-out-soft)_both] items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14"
          >
            {/* Sân khấu */}
            <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-white lg:col-span-7">
              <span
                aria-hidden
                className="pointer-events-none absolute top-[8%] left-1/2 -translate-x-1/2 text-[clamp(4rem,14vw,10rem)] leading-none font-bold tracking-[-0.05em] whitespace-nowrap text-brand/[0.045] select-none"
              >
                {v.model.toUpperCase()}
              </span>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-transparent to-surface/70" />
              <div className="relative px-6 pt-20 pb-10 sm:px-12 sm:pt-28 lg:px-10 lg:pt-32 lg:pb-12">
                <CarImage
                  slug={v.slug}
                  alt={v.imageAlt}
                  sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 90vw"
                  className="relative z-[1] mx-auto aspect-[2/1] max-w-[620px]"
                />
                <div className="car-shadow" aria-hidden />
              </div>
            </div>

            {/* Nội dung */}
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-muted">
                {v.segment} · {v.seats}
              </p>
              <h3 className="text-h3 mt-3">{v.name}</h3>
              <p className="mt-3 text-lg font-medium text-ink/85">{v.tagline}</p>
              <p className="mt-4 text-muted">{v.description}</p>

              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-ink/10 pt-6">
                {v.highlights.slice(0, 4).map((h) => (
                  <div key={h.label}>
                    <dt className="text-xs font-medium text-muted">{h.label}</dt>
                    <dd className="mt-1 font-semibold">{h.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex items-end justify-between gap-4 border-t border-ink/10 pt-6">
                <PriceTag price={getStartingPrice(v)} size="lg" />
                <p className="pb-1 text-sm text-muted">{v.versions.length} phiên bản</p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <QuoteLink vehicle={v.slug} size="lg">
                  Nhận báo giá
                </QuoteLink>
                <ButtonLink to={`/san-pham/${v.slug}`} variant="outline" size="lg" aria-label={`Xem chi tiết ${v.name}`}>
                  Xem chi tiết <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
