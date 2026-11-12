import { ArrowRight, Info } from 'lucide-react'
import { promotions } from '@/data/promotions'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { PromotionCard } from '@/components/promotions/PromotionCard'

export function PromotionsSection() {
  const hasSample = promotions.some((p) => p.isSample)
  const rest = promotions.slice(0, -1)
  const wide = promotions.at(-1)
  return (
    <section aria-labelledby="promo-title" className="section-y relative overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-accent/25 blur-[120px]"
      />
      <div className="container-page relative grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading
            id="promo-title"
            tone="light"
            eyebrow="Ưu đãi"
            title="Chương trình bán hàng"
            description="Chính sách ưu đãi thay đổi theo tháng và theo từng dòng xe. Để lại thông tin để nhận chương trình đang áp dụng."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <QuoteLink variant="light">Nhận ưu đãi hiện hành</QuoteLink>
            <ButtonLink to="/khuyen-mai" variant="outline-light">
              Xem tất cả <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          {hasSample && (
            <p className="mt-8 flex gap-2.5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-200" aria-hidden />
              Nội dung mang tính minh họa, chưa phải chương trình chính thức. Giá trị và thời hạn ưu đãi sẽ được cập nhật
              theo thông báo của đại lý.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <PromotionCard promo={p} />
            </Reveal>
          ))}
          {wide && (
            <Reveal className="sm:col-span-2" delay={280}>
              <PromotionCard promo={wide} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
