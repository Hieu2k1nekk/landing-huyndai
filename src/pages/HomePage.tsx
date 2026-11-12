import { lazy, Suspense } from 'react'
import { ArrowRight } from 'lucide-react'
import { Seo } from '@/seo/head'
import { globalSchemas, vehicleListSchema } from '@/seo/schema'
import { vehicles } from '@/data/vehicles'
import { siteConfig } from '@/config/site'
import { Hero } from '@/components/home/Hero'
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles'
import { PromotionsSection } from '@/components/home/PromotionsSection'
import { WhyHyundai } from '@/components/home/WhyHyundai'
import { QuoteSection } from '@/components/home/QuoteSection'
import { VehicleGrid } from '@/components/vehicles/VehicleGrid'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ButtonLink } from '@/components/ui/Button'
import { PriceNote } from '@/components/ui/PriceNote'

// Carousel (Swiper) tách chunk riêng – nằm cuối trang
const NewsSection = lazy(() => import('@/components/home/NewsSection').then((m) => ({ default: m.NewsSection })))

export default function HomePage() {
  return (
    <>
      <Seo
        title={`${siteConfig.siteName} – Đại lý ô tô Hyundai chính hãng, báo giá lăn bánh`}
        description="Showroom Hyundai chính hãng: Grand i10, Accent, Elantra, Venue, Creta, Tucson, Santa Fe, Stargazer, Custin, Palisade. Nhận báo giá lăn bánh, tư vấn trả góp và đăng ký lái thử."
        path="/"
        keywords={['đại lý Hyundai', 'showroom Hyundai', 'giá xe Hyundai', 'báo giá lăn bánh Hyundai']}
        jsonLd={[...globalSchemas(), vehicleListSchema(vehicles)]}
      />
      <Hero />

      <section aria-labelledby="models-title" className="section-y bg-white">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="models-title"
              eyebrow="Dòng xe"
              title="Chọn chiếc Hyundai dành cho bạn"
              description="10 mẫu xe chính hãng từ hatchback đô thị đến SUV cỡ lớn – lọc theo kiểu dáng để tìm nhanh."
            />
            <ButtonLink to="/bang-gia" variant="ghost">
              Xem bảng giá <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <div className="mt-10">
            <VehicleGrid />
          </div>
          <PriceNote className="mt-8" />
        </div>
      </section>

      <FeaturedVehicles />
      <PromotionsSection />
      <WhyHyundai />
      <QuoteSection />
      <Suspense fallback={<div className="min-h-[640px]" aria-busy="true" />}>
        <NewsSection />
      </Suspense>
    </>
  )
}
