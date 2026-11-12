import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { Vehicle } from '@/types'
import { BODY_TYPE_LABEL, getStartingPrice } from '@/data/vehicles'
import { PriceTag } from '@/components/ui/PriceTag'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { buttonClass } from '@/components/ui/Button'
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
export function VehicleCard({ vehicle, headingLevel = 'h3' }: { vehicle: Vehicle; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  const { color, chosen } = useVehicleColor(vehicle.slug)
  const href = `/san-pham/${vehicle.slug}${chosen ? `?mau=${chosen.id}` : ''}`
  const specs = cardSpecs(vehicle)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[0_1px_2px_rgb(0_20_45/0.04),0_10px_30px_-18px_rgb(0_20_45/0.22)] transition-[box-shadow,border-color,translate] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand/15 hover:shadow-[0_2px_4px_rgb(0_20_45/0.04),0_22px_44px_-20px_rgb(0_20_45/0.3)]">
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden
        className="relative block bg-[linear-gradient(180deg,#f8fafc_0%,#e9eef4_100%)]"
      >
        <span className="absolute top-4 left-4 z-[2] rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-[0_1px_3px_rgb(0_20_45/0.12)]">
          {BODY_TYPE_LABEL[vehicle.bodyType]}
        </span>
        <div className="flex aspect-[16/10] items-end px-7 pt-10 pb-5">
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

      <div className="flex flex-1 flex-col border-t border-line p-5 sm:p-6">
        <p className="text-[0.8125rem] font-medium text-muted">{vehicle.segment}</p>
        <H className="mt-1 text-[1.375rem] leading-tight font-bold tracking-tight">
          <Link to={href} className="transition-colors hover:text-brand">
            {vehicle.name}
          </Link>
        </H>

        <VehicleColorField vehicle={vehicle} sizes={SIZES} className="mt-4" />

        <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-line py-4">
          {specs.map((s) => (
            <div key={s.label} className="min-w-0">
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="mt-1 min-h-[2.75em] text-sm leading-snug font-semibold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>

        <PriceTag price={getStartingPrice(vehicle)} size="lg" className="mt-5" />

        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
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
