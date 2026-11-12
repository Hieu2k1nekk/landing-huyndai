import { Info } from 'lucide-react'
import { Seo } from '@/seo/head'
import { breadcrumbSchema, globalSchemas } from '@/seo/schema'
import { promotions } from '@/data/promotions'
import { PageHeader, HOME_CRUMB } from '@/components/layout/PageHeader'
import { PromotionCard } from '@/components/promotions/PromotionCard'
import { Reveal } from '@/components/ui/Reveal'
import { InstallmentSection } from '@/components/installment/InstallmentSection'

const crumbs = [HOME_CRUMB, { name: 'Khuyến mãi', path: '/khuyen-mai' }]

export default function PromotionsPage() {
  const hasSample = promotions.some((p) => p.isSample)
  return (
    <>
      <Seo
        title="Khuyến mãi xe Hyundai"
        description="Chương trình bán hàng và ưu đãi xe Hyundai theo tháng: ưu đãi giá, hỗ trợ trước bạ, trả góp, quà tặng phụ kiện. Liên hệ để nhận chương trình đang áp dụng."
        path="/khuyen-mai"
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs)]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Ưu đãi"
        title="Chương trình khuyến mãi"
        description="Chính sách bán hàng được cập nhật theo từng tháng và từng dòng xe. Để lại thông tin để nhận chương trình chính xác đang áp dụng."
      />
      <section aria-label="Danh sách chương trình" className="section-y">
        <div className="container-page">
          {hasSample && (
            <p role="note" className="mb-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              Các thẻ có nhãn “Cần cập nhật” là nội dung minh họa, chưa phải chương trình chính thức. Giá trị và thời hạn
              ưu đãi sẽ được đại lý cập nhật khi có thông báo.
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <PromotionCard promo={p} tone="light" headingLevel="h2" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <InstallmentSection />
    </>
  )
}
