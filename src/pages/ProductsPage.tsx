import { Seo } from '@/seo/head'
import { breadcrumbSchema, globalSchemas, vehicleListSchema } from '@/seo/schema'
import { vehicles } from '@/data/vehicles'
import { PageHeader, HOME_CRUMB } from '@/components/layout/PageHeader'
import { VehicleGrid } from '@/components/vehicles/VehicleGrid'
import { QuoteSection } from '@/components/home/QuoteSection'
import { PriceNote } from '@/components/ui/PriceNote'

const crumbs = [HOME_CRUMB, { name: 'Sản phẩm', path: '/san-pham' }]

export default function ProductsPage() {
  return (
    <>
      <Seo
        title="Các dòng xe Hyundai chính hãng"
        description="Danh sách các dòng xe Hyundai: sedan, SUV, MPV, hatchback. So sánh kiểu dáng, số chỗ, giá tham khảo và nhận báo giá lăn bánh."
        path="/san-pham"
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs), vehicleListSchema(vehicles)]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Sản phẩm"
        title="Các dòng xe Hyundai"
        description="Từ hatchback đô thị nhỏ gọn đến SUV 7 chỗ cao cấp – tìm mẫu xe phù hợp nhu cầu và ngân sách của bạn."
      />
      <section aria-label="Danh sách xe" className="section-y">
        <div className="container-page">
          <VehicleGrid headingLevel="h2" />
          <PriceNote className="mt-8" />
        </div>
      </section>
      <QuoteSection />
    </>
  )
}
