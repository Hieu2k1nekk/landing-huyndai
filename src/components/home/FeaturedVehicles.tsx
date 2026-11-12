import { ArrowUpRight } from 'lucide-react'
import { featuredVehicles, getStartingPrice } from '@/data/vehicles'
import { pricing } from '@/config/site'
import { formatPriceShort } from '@/utils/format'
import { cn } from '@/utils/cn'
import { CarImage } from '@/components/ui/CarImage'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { QuoteLink } from '@/components/forms/QuoteLink'

/** Bố cục editorial xen kẽ trái/phải cho 2–3 mẫu xe nổi bật */
export function FeaturedVehicles() {
  const list = featuredVehicles().slice(0, 3)
  return (
    <section aria-labelledby="featured-title" className="section-y bg-surface">
      <div className="container-page">
        <SectionHeading
          id="featured-title"
          eyebrow="Mẫu xe nổi bật"
          title="SUV cho mọi hành trình gia đình"
          description="Từ đô thị đến những chuyến đi dài – những mẫu SUV được nhiều gia đình Việt lựa chọn."
        />

        <div className="mt-12 space-y-16 lg:mt-16 lg:space-y-24">
          {list.map((v, i) => {
            const price = getStartingPrice(v)
            const flip = i % 2 === 1
            return (
              <Reveal
                as="article"
                key={v.slug}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
              >
                <div className={cn('relative lg:col-span-7', flip && 'lg:order-2')}>
                  <div
                    aria-hidden
                    className={cn(
                      'absolute inset-y-[12%] rounded-[2rem] bg-white',
                      flip ? 'right-0 left-[12%]' : 'right-[12%] left-0',
                    )}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 text-[clamp(3.5rem,11vw,8.5rem)] leading-none font-bold tracking-tight whitespace-nowrap text-brand/[0.05] select-none"
                  >
                    {v.model.toUpperCase()}
                  </span>
                  <div className="relative px-2 py-6 sm:px-8">
                    <CarImage
                      slug={v.slug}
                      alt={v.imageAlt}
                      sizes="(min-width: 1024px) 680px, 100vw"
                      className="relative z-[1] aspect-[2/1]"
                    />
                    <div className="car-shadow" aria-hidden />
                  </div>
                </div>

                <div className={cn('lg:col-span-5', flip && 'lg:order-1')}>
                  <p className="text-sm font-semibold text-accent">
                    0{i + 1} · {v.segment}
                  </p>
                  <h3 className="mt-3 text-3xl font-bold sm:text-4xl">{v.name}</h3>
                  <p className="mt-2 text-lg font-medium text-ink/80">{v.tagline}</p>
                  <p className="mt-4 text-muted">{v.description}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                    {v.highlights.slice(0, 4).map((h) => (
                      <div key={h.label} className="bg-white px-4 py-3">
                        <dt className="text-xs text-muted">{h.label}</dt>
                        <dd className="mt-0.5 font-semibold">{h.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div>
                      <p className="text-xs text-muted">Giá {pricing.verified ? 'niêm yết' : 'tham khảo'} từ</p>
                      <p className="text-2xl font-bold text-brand">
                        {formatPriceShort(price)}
                        {price != null && !pricing.verified && (
                          <span className="align-super text-sm text-muted">*</span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <QuoteLink vehicle={v.slug}>Nhận báo giá</QuoteLink>
                      <ButtonLink to={`/san-pham/${v.slug}`} variant="ghost" aria-label={`Xem chi tiết ${v.name}`}>
                        Xem chi tiết <ArrowUpRight className="size-4" aria-hidden />
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
