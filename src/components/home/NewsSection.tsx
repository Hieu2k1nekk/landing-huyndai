import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { sortedNews } from '@/data/news'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ButtonLink } from '@/components/ui/Button'
import { NewsCard } from '@/components/news/NewsCard'

export function NewsSection() {
  const list = sortedNews().slice(0, 6)
  const swiperRef = useRef<SwiperType | null>(null)

  const navBtn =
    'grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand hover:text-brand'

  return (
    <section aria-labelledby="news-title" className="section-y overflow-hidden bg-white">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="news-title"
            eyebrow="Tin tức & Kinh nghiệm"
            title="Cẩm nang cho người mua xe"
            description="Kiến thức mua xe, so sánh mẫu xe và hướng dẫn sử dụng hữu ích."
          />
          <div className="flex items-center gap-2">
            <button type="button" className={navBtn} aria-label="Bài trước" onClick={() => swiperRef.current?.slidePrev()}>
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button type="button" className={navBtn} aria-label="Bài tiếp theo" onClick={() => swiperRef.current?.slideNext()}>
              <ArrowRight className="size-5" aria-hidden />
            </button>
            <ButtonLink to="/tin-tuc" variant="ghost" className="ml-1 hidden sm:inline-flex">
              Xem tất cả
            </ButtonLink>
          </div>
        </div>

        <Swiper
          className="news-swiper mt-10"
          modules={[A11y, Keyboard]}
          onSwiper={(s) => (swiperRef.current = s)}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{ prevSlideMessage: 'Bài trước', nextSlideMessage: 'Bài tiếp theo' }}
          spaceBetween={20}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2.1, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
        >
          {list.map((a) => (
            <SwiperSlide key={a.slug}>
              <NewsCard article={a} />
            </SwiperSlide>
          ))}
        </Swiper>

        <ButtonLink to="/tin-tuc" variant="outline" className="mt-10 w-full sm:hidden">
          Xem tất cả bài viết
        </ButtonLink>
      </div>
    </section>
  )
}
