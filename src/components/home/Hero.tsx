import { ArrowRight, BadgeCheck, CalendarCheck, Wallet } from 'lucide-react'
import { getStartingPrice, getVehicle, HERO_VEHICLE_SLUG } from '@/data/vehicles'
import { pricing } from '@/config/site'
import { formatPriceShort } from '@/utils/format'
import { CarImage } from '@/components/ui/CarImage'
import { ButtonLink } from '@/components/ui/Button'
import { QuoteLink } from '@/components/forms/QuoteLink'

const services = [
  { icon: Wallet, label: 'Tư vấn trả góp' },
  { icon: CalendarCheck, label: 'Đăng ký lái thử' },
  { icon: BadgeCheck, label: 'Xe chính hãng' },
]

/**
 * Hero bất đối xứng: nội dung bên trái, tấm nền "showroom" xanh đậm
 * tràn mép phải với ảnh xe lớn (ảnh LCP – tải ưu tiên, không lazy).
 */
export function Hero() {
  const car = getVehicle(HERO_VEHICLE_SLUG)!
  const price = getStartingPrice(car)

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white">
      {/* Tấm nền showroom */}
      <div
        aria-hidden
        className="showroom-panel absolute inset-y-0 right-0 hidden w-[46%] rounded-bl-[3rem] lg:block"
      />

      <div className="container-page relative grid items-center gap-8 pt-10 pb-0 lg:min-h-[640px] lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:py-16 xl:min-h-[700px]">
        <div className="max-w-xl animate-[fade-up_0.7s_var(--ease-out-soft)_both]">
          <p className="eyebrow mb-5">
            <span className="h-px w-6 bg-accent" aria-hidden />
            Đại lý ủy quyền Hyundai
          </p>
          <h1 id="hero-title" className="text-[2.25rem] leading-[1.08] font-bold sm:text-5xl xl:text-[3.75rem]">
            Khám phá phong cách di chuyển mới cùng <span className="text-brand">Hyundai</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted sm:text-lg">
            Đầy đủ các dòng sedan, SUV, MPV và hatchback chính hãng. Nhận báo giá lăn bánh, tư vấn trả góp và lịch lái
            thử phù hợp với bạn.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/san-pham" size="lg" variant="primary">
              Khám phá dòng xe <ArrowRight className="size-5" aria-hidden />
            </ButtonLink>
            <QuoteLink size="lg" variant="outline">
              Nhận báo giá
            </QuoteLink>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink/80">
            {services.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="size-4.5 text-accent" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative -mx-5 md:-mx-8 lg:mx-0 lg:-mr-10 xl:-mr-24">
          {/* Mobile/tablet: tấm nền chỉ nằm sau ảnh xe để không đè lên chữ */}
          <div aria-hidden className="showroom-panel absolute inset-x-0 top-[28%] bottom-0 lg:hidden" />
          <div className="relative px-2 pt-4 pb-10 sm:px-6 lg:pb-6">
            <CarImage
              slug={car.slug}
              alt={car.imageAlt}
              priority
              sizes="(min-width: 1280px) 760px, (min-width: 1024px) 55vw, 100vw"
              className="relative z-[1] aspect-[2/1] drop-shadow-[0_30px_30px_rgb(0_20_45/0.35)]"
            />
            <div className="car-shadow" aria-hidden />
          </div>
          <div className="absolute bottom-4 left-5 z-[2] rounded-2xl bg-white/95 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur sm:left-8 lg:bottom-0 lg:left-4">
            <p className="text-xs font-medium text-muted">{car.name}</p>
            <p className="text-base font-bold text-brand">
              Từ {formatPriceShort(price)}
              {price != null && !pricing.verified && <span className="align-super text-xs text-muted">*</span>}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
