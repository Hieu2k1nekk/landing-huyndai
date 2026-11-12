import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { getStartingPrice, getVehicle } from '@/data/vehicles'
import { getHeroImage } from '@/utils/images'
import { ButtonLink } from '@/components/ui/Button'
import { PriceTag } from '@/components/ui/PriceTag'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { cn } from '@/utils/cn'

/** Ảnh hero là ảnh chụp thực tế của chính mẫu xe (nguồn: Hyundai Thành Công) */
const SLIDES = [
  {
    vehicle: 'tucson',
    image: 'tucson-hev-run1',
    alt: 'Hyundai Tucson màu đỏ vận hành trên đường phố',
    position: '47% 62%',
    headline: 'Tiên phong trong thiết kế, vững vàng trên mọi cung đường.',
  },
  {
    vehicle: 'palisade',
    image: 'palisade-0056',
    alt: 'Hyundai Palisade thế hệ mới màu trắng trên cung đường đèo',
    position: '49% 55%',
    headline: 'Bề thế, rộng rãi cho những hành trình cùng cả gia đình.',
  },
] as const

const DURATION = 7000

export function Hero() {
  const [index, setIndex] = useState(0)
  /** Tự chuyển slide chỉ bật sau khi hydrate (HTML tĩnh luôn hiển thị slide 1) */
  const [mounted, setMounted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hiddenTab, setHiddenTab] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const rootRef = useRef<HTMLElement>(null)

  const count = SLIDES.length
  const go = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count)
      setRunKey((k) => k + 1)
    },
    [count],
  )

  useEffect(() => {
    setMounted(true)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true)
    const onVis = () => setHiddenTab(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const playing = mounted && !paused && !hovering && !focused && !hiddenTab

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => go(index + 1), DURATION)
    return () => window.clearTimeout(t)
  }, [playing, index, runKey, go])

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Mẫu xe tiêu biểu"
      className="relative -mt-16 overflow-hidden bg-brand-900 text-white lg:-mt-[4.5rem]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <div className="grid lg:h-[clamp(640px,100svh,880px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ---------- Ảnh (trên mobile nằm trên, desktop tràn mép phải) ---------- */}
        <div className="relative aspect-square overflow-hidden sm:aspect-[4/3] md:aspect-[16/10] lg:order-2 lg:aspect-auto lg:h-full">
          {SLIDES.map((s, i) => {
            const img = getHeroImage(s.image)
            const active = i === index
            if (!img) return null
            return (
              <picture
                key={s.image}
                className={cn(
                  'absolute inset-0 transition-opacity duration-1000 ease-out',
                  active ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden={!active}
              >
                <source media="(min-width: 640px)" srcSet={img.landscapeSrcSet} sizes="(min-width: 1024px) 60vw, 100vw" />
                <img
                  src={img.src}
                  srcSet={img.squareSrcSet}
                  sizes="100vw"
                  width={img.width}
                  height={img.height}
                  alt={s.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding={i === 0 ? 'sync' : 'async'}
                  style={{ objectPosition: s.position }}
                  className={cn(
                    'size-full object-cover',
                    active && mounted && 'animate-[hero-zoom_8s_var(--ease-out-soft)_both]',
                  )}
                />
              </picture>
            )
          })}
          {/* Scrim: header phía trên + chuyển tiếp sang khối chữ */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-900/70 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-900 to-transparent lg:hidden" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-brand-900 to-transparent lg:block" />
        </div>

        {/* ---------- Nội dung ---------- */}
        <div className="relative flex flex-col justify-center px-5 pt-2 pb-8 md:px-8 lg:order-1 lg:pt-[4.5rem] lg:pr-10 lg:pb-28 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <h1 className="eyebrow text-white/70">
            <span className="h-px w-8 bg-accent" aria-hidden />
            Showroom Hyundai chính hãng
          </h1>

          <div className="relative mt-6 grid" aria-live={playing ? 'off' : 'polite'}>
            {SLIDES.map((s, i) => {
              const car = getVehicle(s.vehicle)!
              const active = i === index
              return (
                <div
                  key={s.vehicle}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${count}: ${car.name}`}
                  aria-hidden={!active}
                  inert={!active}
                  className={cn(
                    'col-start-1 row-start-1 transition-[opacity,transform,visibility] duration-700 ease-out',
                    active ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-3 opacity-0',
                  )}
                >
                  <p className="text-sm font-medium text-white/60">{car.segment}</p>
                  <p className="text-display mt-2">{car.model}</p>
                  <p className="text-lead mt-5 max-w-md text-white/80">{s.headline}</p>
                  <PriceTag price={getStartingPrice(car)} tone="light" size="lg" className="mt-7" />
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink to={`/san-pham/${car.slug}`} variant="light" size="lg">
                      Khám phá {car.model} <ArrowRight className="size-5" aria-hidden />
                    </ButtonLink>
                    <QuoteLink vehicle={car.slug} variant="outline-light" size="lg">
                      Nhận báo giá
                    </QuoteLink>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ---------- Điều khiển ---------- */}
          <div className="mt-10 flex items-center gap-4 lg:absolute lg:right-10 lg:bottom-10 lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:mt-0">
            <ul className="flex flex-1 gap-5">
              {SLIDES.map((s, i) => {
                const car = getVehicle(s.vehicle)!
                const active = i === index
                return (
                  <li key={s.vehicle} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={active ? 'true' : undefined}
                      aria-label={`Xem ${car.name}`}
                      className={cn(
                        'group block w-full pt-1 text-left text-sm font-semibold transition-colors',
                        active ? 'text-white' : 'text-white/50 hover:text-white/80',
                      )}
                    >
                      <span className="relative block h-0.5 overflow-hidden rounded-full bg-white/20">
                        {active && (
                          <span
                            key={`${index}-${runKey}`}
                            className={cn(
                              'absolute inset-0 origin-left bg-white',
                              playing
                                ? 'animate-[progress_7s_linear_both]'
                                : mounted && 'animate-[progress_7s_linear_both] [animation-play-state:paused]',
                            )}
                            style={!mounted ? { transform: 'scaleX(0)' } : undefined}
                          />
                        )}
                      </span>
                      <span className="mt-3 block truncate">{car.model}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Mẫu xe trước"
                className="grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Mẫu xe tiếp theo"
                className="grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Tự động chuyển mẫu xe' : 'Tạm dừng tự động chuyển'}
                className="grid size-10 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
