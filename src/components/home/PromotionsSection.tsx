import { ArrowRight, Info } from 'lucide-react'
import { promotions } from '@/data/promotions'
import { getVehicle } from '@/data/vehicles'
import { NewsImage } from '@/components/ui/NewsImage'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { QuoteLink } from '@/components/forms/QuoteLink'

/**
 * Banner ưu đãi lớn (ảnh xe thật) + danh sách chính sách dạng đánh số.
 * Không hiển thị giá trị/thời hạn khi chưa có chương trình thật (isSample).
 */
export function PromotionsSection() {
  const hasSample = promotions.some((p) => p.isSample)

  return (
    <section aria-labelledby="promo-title" className="section-y bg-white">
      <div className="container-page">
        <Reveal className="grid overflow-hidden rounded-[var(--radius-panel)] bg-brand-900 text-white lg:grid-cols-2">
          <div className="relative aspect-[3/2] lg:order-2 lg:aspect-auto lg:min-h-[520px]">
            <NewsImage
              image="tucson-hev-1"
              alt="Hyundai Tucson Hybrid màu đỏ đỗ trước showroom"
              sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent to-40% lg:bg-gradient-to-r lg:from-brand-900 lg:to-25%"
            />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14 xl:p-16">
            <p className="eyebrow text-sky-300">
              <span className="h-px w-8 bg-sky-300" aria-hidden />
              Ưu đãi
            </p>
            <h2 id="promo-title" className="text-h2 mt-4 text-white">
              Ưu đãi &amp; chính sách bán hàng
            </h2>
            <p className="text-lead mt-5 max-w-md text-white/70">
              Chính sách ưu đãi thay đổi theo thời điểm và từng dòng xe. Để lại thông tin, tư vấn viên sẽ gửi chương trình
              đang áp dụng cho mẫu xe bạn quan tâm.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <QuoteLink variant="light" size="lg">
                Nhận ưu đãi hiện hành
              </QuoteLink>
              <ButtonLink to="/khuyen-mai" variant="outline-light" size="lg">
                Xem tất cả <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <ol className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-10">
          {promotions.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 60} className="border-t border-line py-7">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {p.isSample && (
                  <span className="text-[0.6875rem] font-semibold tracking-wide text-amber-700 uppercase">
                    Cần cập nhật
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              {p.value && <p className="mt-1 text-xl font-bold text-brand">{p.value}</p>}
              <p className="mt-2 text-[0.9375rem] text-muted">{p.description}</p>
              {(p.appliesTo?.length || p.validUntil) && (
                <p className="mt-3 text-sm text-muted">
                  {p.appliesTo?.length ? `Áp dụng: ${p.appliesTo.map((s) => getVehicle(s)?.model ?? s).join(', ')}` : ''}
                  {p.appliesTo?.length && p.validUntil ? ' · ' : ''}
                  {p.validUntil ? `Thời hạn: ${p.validUntil}` : ''}
                </p>
              )}
            </Reveal>
          ))}
        </ol>
        {hasSample && (
          <p className="mt-2 flex gap-3 border-t border-line pt-6 text-sm text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
            Nội dung mang tính minh họa, chưa phải chương trình chính thức. Giá trị và thời hạn ưu đãi sẽ được cập nhật theo
            thông báo của đại lý.
          </p>
        )}
      </div>
    </section>
  )
}
