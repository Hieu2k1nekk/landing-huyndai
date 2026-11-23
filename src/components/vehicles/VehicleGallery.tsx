import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, FreeMode, Keyboard, Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/zoom'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { getGallery } from '@/utils/images'
import { cn } from '@/utils/cn'

const SLIDE_SIZES = '(min-width: 1280px) 1152px, 100vw'

/** Ảnh gần vuông/dọc hiển thị nguyên khung (contain), ảnh ngang phủ kín khung (cover) */
const isWide = (w: number, h: number) => w / h >= 1.35

const navBtn =
  'grid size-11 place-items-center rounded-full bg-white/90 text-brand shadow-[var(--shadow-pop)] backdrop-blur transition hover:bg-white disabled:pointer-events-none disabled:opacity-0'

/**
 * Thư viện ảnh xe: slider (tự trượt, bấm mũi tên / vuốt / phím mũi tên) + dải ảnh nhỏ.
 * Bấm vào ảnh để mở khung xem phóng to toàn màn hình (zoom bằng chạm đúp / chụm tay / cuộn chuột).
 */
export function VehicleGallery({ slug, name }: { slug: string; name: string }) {
  const images = getGallery(slug)
  const [main, setMain] = useState<SwiperType | null>(null)
  const [thumbs, setThumbs] = useState<SwiperType | null>(null)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  // Dừng tự trượt khi đang xem phóng to hoặc khi người dùng bật giảm chuyển động
  useEffect(() => {
    if (!main?.autoplay) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (lightbox != null || reduce) main.autoplay.stop()
    else main.autoplay.start()
  }, [main, lightbox])

  if (images.length === 0) return null

  return (
    <>
      <div className="relative">
        <Swiper
          modules={[A11y, Autoplay, Keyboard, Thumbs]}
          onSwiper={setMain}
          onSlideChange={(s) => setActive(s.activeIndex)}
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
          autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          keyboard={{ enabled: true }}
          rewind
          speed={600}
          a11y={{ slideLabelMessage: `${name} – ảnh {{index}} / {{slidesLength}}` }}
          className="overflow-hidden rounded-[var(--radius-card)] bg-surface"
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.id}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Phóng to ảnh ${i + 1} của ${name}`}
                className="group relative block aspect-[4/3] w-full cursor-zoom-in sm:aspect-[16/10]"
              >
                <img
                  src={img.src}
                  srcSet={img.srcSet}
                  sizes={SLIDE_SIZES}
                  width={img.width}
                  height={img.height}
                  alt={`${name} – hình ảnh thực tế ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className={cn('size-full', isWide(img.width, img.height) ? 'object-cover' : 'object-contain')}
                />
                <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100">
                  <Expand className="size-3.5" aria-hidden /> Phóng to
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <button type="button" aria-label="Ảnh trước" onClick={() => main?.slidePrev()} className={cn(navBtn, 'absolute top-1/2 left-3 z-10 -translate-y-1/2 max-sm:hidden')}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" aria-label="Ảnh tiếp theo" onClick={() => main?.slideNext()} className={cn(navBtn, 'absolute top-1/2 right-3 z-10 -translate-y-1/2 max-sm:hidden')}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
        <p className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white tabular-nums backdrop-blur" aria-hidden>
          {active + 1} / {images.length}
        </p>
      </div>

      {/* Dải ảnh nhỏ */}
      <Swiper
        modules={[FreeMode, Thumbs]}
        onSwiper={setThumbs}
        freeMode
        watchSlidesProgress
        slidesPerView={3.4}
        spaceBetween={10}
        breakpoints={{ 640: { slidesPerView: 5.2 }, 1024: { slidesPerView: 6.2 } }}
        className="mt-3"
      >
        {images.map((img, i) => (
          <SwiperSlide key={img.id} className="cursor-pointer">
            <img
              src={img.src}
              srcSet={img.srcSet}
              sizes="(min-width: 1024px) 180px, 30vw"
              width={img.width}
              height={img.height}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className={cn(
                'aspect-[3/2] w-full rounded-lg object-cover ring-2 ring-offset-2 transition-opacity',
                i === active ? 'opacity-100 ring-brand' : 'opacity-60 ring-transparent hover:opacity-90',
              )}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Xem phóng to */}
      <Dialog.Root open={lightbox != null} onOpenChange={(o) => !o && setLightbox(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/92" />
          <Dialog.Content
            className="fixed inset-0 z-[60] outline-none"
            aria-describedby={undefined}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Dialog.Title className="sr-only">Hình ảnh {name}</Dialog.Title>
            {lightbox != null && (
              <LightboxSlider
                images={images}
                name={name}
                initial={lightbox}
                onChange={(i) => {
                  setActive(i)
                  main?.slideTo(i, 0)
                }}
              />
            )}
            <Dialog.Close
              aria-label="Đóng"
              className="absolute top-4 right-4 z-20 grid size-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

function LightboxSlider({
  images,
  name,
  initial,
  onChange,
}: {
  images: ReturnType<typeof getGallery>
  name: string
  initial: number
  onChange: (i: number) => void
}) {
  const [sw, setSw] = useState<SwiperType | null>(null)
  const [index, setIndex] = useState(initial)

  return (
    <>
      <Swiper
        modules={[A11y, Keyboard, Navigation, Pagination, Zoom]}
        onSwiper={setSw}
        initialSlide={initial}
        keyboard={{ enabled: true }}
        zoom={{ maxRatio: 3 }}
        spaceBetween={24}
        onSlideChange={(s) => {
          setIndex(s.activeIndex)
          onChange(s.activeIndex)
        }}
        className="size-full"
      >
        {images.map((img, i) => (
          <SwiperSlide key={img.id}>
            <div className="swiper-zoom-container">
              <img
                src={img.fullSrc}
                srcSet={img.fullSrcSet}
                sizes="100vw"
                alt={`${name} – hình ảnh ${i + 1}`}
                loading={Math.abs(i - initial) <= 1 ? 'eager' : 'lazy'}
                draggable={false}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button type="button" aria-label="Ảnh trước" onClick={() => sw?.slidePrev()} disabled={index === 0} className={cn(navBtn, 'absolute top-1/2 left-4 z-20 -translate-y-1/2 max-sm:hidden')}>
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button type="button" aria-label="Ảnh tiếp theo" onClick={() => sw?.slideNext()} disabled={index === images.length - 1} className={cn(navBtn, 'absolute top-1/2 right-4 z-20 -translate-y-1/2 max-sm:hidden')}>
        <ChevronRight className="size-5" aria-hidden />
      </button>
      <p className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white tabular-nums backdrop-blur" aria-live="polite">
        {index + 1} / {images.length}
      </p>
    </>
  )
}
