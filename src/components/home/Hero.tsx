import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getVehicle } from '@/data/vehicles'
import { getHeroImage } from '@/utils/images'
import { cn } from '@/utils/cn'

/** Ảnh hero: nhà máy Hyundai Thành Công Việt Nam */
const SLIDES = [
  {
    vehicle: 'tucson',
    image: 'hero-factory',
    alt: 'Nhà máy sản xuất ô tô Hyundai Thành Công Việt Nam',
    position: '60% 50%',
  },
] as const

const DURATION = 7000

export function Hero() {
  const [index, setIndex] = useState(0)
  /** Tự chuyển slide chỉ bật sau khi hydrate (HTML tĩnh luôn hiển thị slide 1) */
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [hiddenTab, setHiddenTab] = useState(false)

  const count = SLIDES.length
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])

  useEffect(() => {
    setMounted(true)
    setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches)
    const onVis = () => setHiddenTab(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const playing = mounted && !reduced && !hovering && !hiddenTab
  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => go(index + 1), DURATION)
    return () => window.clearTimeout(t)
  }, [playing, index, go])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Mẫu xe tiêu biểu"
      className="relative -mt-16 overflow-hidden bg-brand-900 text-white lg:-mt-[4.5rem]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative flex min-h-[300px] flex-col sm:min-h-[520px] lg:h-[clamp(520px,42vw,800px)]">
        {/* ---------- Ảnh toàn khung hình ---------- */}
        <div className="absolute inset-0">
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
                <img
                  src={img.landscapeSrc}
                  srcSet={img.landscapeSrcSet}
                  sizes="(max-width: 639px) 750px, 100vw"
                  width={img.landscapeWidth}
                  height={img.landscapeHeight}
                  alt={s.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding={i === 0 ? 'sync' : 'async'}
                  style={{ objectPosition: s.position }}
                  className={cn(
                    'size-full object-cover',
                  )}
                />
              </picture>
            )
          })}
          {/* Scrim: header phía trên, nền tối dần ở đáy cho chữ dễ đọc */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-brand-900/70 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-900/60 to-transparent" />
        </div>

        {/* ---------- Nội dung (đáy trái) ---------- */}
        <div className="container-page relative z-10 mt-auto pt-40 pb-6 lg:pb-8">
          <h1 className="sr-only" aria-live={playing ? 'off' : 'polite'}>
            Showroom Hyundai chính hãng – Hyundai Thành Công Việt Nam
          </h1>

          {/* ---------- Điều khiển tối giản ---------- */}
          <div className={cn('flex items-center justify-between', count < 2 && 'hidden')}>
            <ul className="flex items-center gap-3">
              {SLIDES.map((s, i) => {
                const car = getVehicle(s.vehicle)!
                return (
                  <li key={s.vehicle}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={i === index ? 'true' : undefined}
                      aria-label={`Xem ${car.name}`}
                      className="group flex h-8 items-center"
                    >
                      <span
                        className={cn(
                          'block h-1 rounded-full transition-all duration-500',
                          i === index ? 'w-10 bg-white' : 'w-5 bg-white/35 group-hover:bg-white/60',
                        )}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="flex items-center gap-1">
              {[
                { label: 'Mẫu xe trước', Icon: ChevronLeft, d: -1 },
                { label: 'Mẫu xe tiếp theo', Icon: ChevronRight, d: 1 },
              ].map(({ label, Icon, d }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => go(index + d)}
                  className="grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-5" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
