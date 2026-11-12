import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Vehicle } from '@/types'
import { getStartingPrice } from '@/data/vehicles'
import { pricing } from '@/config/site'
import { formatPriceShort } from '@/utils/format'
import { CarImage } from '@/components/ui/CarImage'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { buttonClass } from '@/components/ui/Button'

export function VehicleCard({ vehicle, headingLevel = 'h3' }: { vehicle: Vehicle; headingLevel?: 'h2' | 'h3' }) {
  const price = getStartingPrice(vehicle)
  const H = headingLevel
  const href = `/san-pham/${vehicle.slug}`

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lift)]">
      <div className="relative overflow-hidden bg-gradient-to-b from-surface to-[#eaeef4] px-6 pt-10 pb-6">
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand shadow-sm">
          {vehicle.segment}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 text-[4.5rem] leading-none font-bold tracking-tight whitespace-nowrap text-white/70 select-none"
        >
          {vehicle.model.toUpperCase()}
        </span>
        <Link to={href} tabIndex={-1} aria-hidden className="relative block">
          <CarImage
            slug={vehicle.slug}
            alt={vehicle.imageAlt}
            sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="relative z-[1] aspect-[2/1] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <H className="text-xl font-bold">
          <Link to={href} className="transition-colors hover:text-brand">
            {vehicle.name}
          </Link>
        </H>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] text-muted">{vehicle.description}</p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-xs font-medium text-muted">Giá {pricing.verified ? 'niêm yết' : 'tham khảo'} từ</p>
            <p className="mt-0.5 text-lg font-bold text-brand">
              {formatPriceShort(price)}
              {price != null && !pricing.verified && <span className="align-super text-xs text-muted">*</span>}
            </p>
          </div>
          <p className="text-sm text-muted">{vehicle.seats}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <Link to={href} className={buttonClass('outline', 'sm', 'w-full')} aria-label={`Khám phá ${vehicle.name}`}>
            Khám phá <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <QuoteLink vehicle={vehicle.slug} size="sm" className="w-full">
            Nhận báo giá
          </QuoteLink>
        </div>
      </div>
    </article>
  )
}
