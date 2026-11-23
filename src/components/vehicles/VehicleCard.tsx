import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { Vehicle } from '@/types'
import { BODY_TYPE_LABEL, getStartingPrice } from '@/data/vehicles'
import { PriceTag } from '@/components/ui/PriceTag'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { buttonClass } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useVehicleColor } from '@/hooks/useVehicleColor'
import { VehicleImagePreview } from './color/VehicleImagePreview'
import { VehicleColorField } from './color/VehicleColorField'

const SIZES = '(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw'

/** 3 thông số hiển thị trên card (lấy từ highlights; thiếu thì bỏ qua – không tự tạo) */
function cardSpecs(v: Vehicle) {
  const get = (label: string) => v.highlights.find((h) => h.label === label)?.value
  return [
    { label: 'Động cơ', value: get('Động cơ') },
    { label: 'Hộp số', value: get('Hộp số') },
    { label: 'Số chỗ', value: get('Số chỗ') ?? v.seats },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value))
}

/**
 * Thẻ xe dạng khối: nền trắng, viền + đổ bóng nhẹ để tách khỏi nền section.
 * Ảnh (đổi theo màu) – phân khúc – tên – chấm màu – thông số – giá – hành động.
 * Màu đang chọn lưu theo slug (useVehicleColor) -> giữ khi sang trang chi tiết / form báo giá.
 */
export function VehicleCard({
  vehicle,
  headingLevel = 'h3',
  compactMobile = false,
}: {
  vehicle: Vehicle
  headingLevel?: 'h2' | 'h3'
  /** Mobile: chỉ hiện ảnh, tên và giá (ẩn phân khúc, màu, thông số, nút) – cả thẻ bấm được */
  compactMobile?: boolean
}) {
  const hideOnMobile = compactMobile && 'max-sm:hidden'
  const H = headingLevel
  const { color, chosen } = useVehicleColor(vehicle.slug)
  const href = `/san-pham/${vehicle.slug}${chosen ? `?mau=${chosen.id}` : ''}`
  const specs = cardSpecs(vehicle)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[0_1px_2px_rgb(0_20_45/0.04),0_10px_30px_-18px_rgb(0_20_45/0.22)] transition-[box-shadow,border-color,translate] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand/15 hover:shadow-[0_2px_4px_rgb(0_20_45/0.04),0_22px_44px_-20px_rgb(0_20_45/0.3)]">
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden
        className="relative block bg-[linear-gradient(180deg,#f8fafc_0%,#e9eef4_100%)]"
      >
        <span className={cn('absolute top-4 left-4 z-[2] rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-[0_1px_3px_rgb(0_20_45/0.12)]', hideOnMobile)}>
          {BODY_TYPE_LABEL[vehicle.bodyType]}
        </span>
        <div className={cn('flex aspect-[16/10] items-end px-7 pt-10 pb-5', compactMobile && 'max-sm:px-3 max-sm:pt-5 max-sm:pb-2')}>
          <div className="relative w-full">
            <VehicleImagePreview
              slug={vehicle.slug}
              name={vehicle.name}
              color={color}
              sizes={SIZES}
              className="z-[1] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
            />
            <div className="car-shadow" aria-hidden />
          </div>
        </div>
      </Link>

      <div className={cn('flex flex-1 flex-col border-t border-line p-5 sm:p-6', compactMobile && 'max-sm:p-3')}>
        <p className={cn('text-[0.8125rem] font-medium text-muted', hideOnMobile)}>{vehicle.segment}</p>
        <H className={cn('mt-1 text-[1.375rem] leading-tight font-bold tracking-tight', compactMobile && 'max-sm:mt-0 max-sm:text-base')}>
          <Link
            to={href}
            className={cn('transition-colors hover:text-brand', compactMobile && 'max-sm:after:absolute max-sm:after:inset-0 max-sm:after:content-[""]')}
          >
            {vehicle.name}
          </Link>
        </H>

        <VehicleColorField vehicle={vehicle} sizes={SIZES} className={cn('mt-4', hideOnMobile)} />

        <dl className={cn('mt-4 grid grid-cols-3 gap-3 border-y border-line py-4', hideOnMobile)}>
          {specs.map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="mt-1 min-h-[2.75em] text-sm leading-snug font-semibold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>

        <PriceTag
          price={getStartingPrice(vehicle)}
          size="lg"
          className={cn('mt-5', compactMobile && 'max-sm:mt-1.5 max-sm:[&_p+p]:text-lg')}
        />

        {compactMobile && (
          <p
            aria-hidden
            className="mt-auto inline-flex items-center justify-between gap-1 border-t border-line pt-2.5 text-[0.8125rem] font-semibold text-accent sm:hidden"
          >
            Xem chi tiết
            <ArrowRight className="size-3.5" />
          </p>
        )}

        <div className={cn('mt-auto grid grid-cols-2 gap-3 pt-5', hideOnMobile)}>
          <QuoteLink vehicle={vehicle.slug} color={color?.id} size="md" className="px-3">
            Nhận báo giá
          </QuoteLink>
          <Link to={href} aria-label={`Xem chi tiết ${vehicle.name}`} className={buttonClass('outline', 'md', 'px-3')}>
            Chi tiết
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
