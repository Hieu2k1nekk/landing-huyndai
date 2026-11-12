import { lazy, Suspense } from 'react'
import { Calculator, Clock, Phone, ShieldCheck } from 'lucide-react'
import { QUOTE_ANCHOR } from '@/data/navigation'
import { dealer, telHref } from '@/config/site'
import { SectionHeading } from '@/components/ui/SectionHeading'

// Form (zod + react-hook-form) tách chunk riêng: nằm dưới màn hình đầu, không chặn LCP.
// Prerender vẫn chờ Suspense nên HTML tĩnh đầy đủ form.
const QuoteForm = lazy(() => import('@/components/forms/QuoteForm').then((m) => ({ default: m.QuoteForm })))

const benefits = [
  { icon: Calculator, title: 'Bảng tính lăn bánh chi tiết', text: 'Theo phiên bản và tỉnh/thành đăng ký xe.' },
  { icon: ShieldCheck, title: 'Tư vấn phương án tài chính', text: 'So sánh trả thẳng và trả góp phù hợp ngân sách.' },
  { icon: Clock, title: 'Phản hồi nhanh', text: 'Chuyên viên liên hệ trong giờ làm việc.' },
]

export function QuoteSection({
  defaultVehicle,
  headingAs = 'h2',
  title = 'Nhận báo giá lăn bánh',
}: {
  defaultVehicle?: string
  headingAs?: 'h1' | 'h2'
  title?: string
}) {
  return (
    <section id={QUOTE_ANCHOR} aria-labelledby="quote-title" className="section-y scroll-mt-16 bg-surface">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:pt-4">
          <SectionHeading
            id="quote-title"
            as={headingAs}
            eyebrow="Báo giá & tư vấn"
            title={title}
            description="Để lại thông tin, chuyên viên tư vấn sẽ gửi báo giá chi tiết cùng chương trình bán hàng đang áp dụng."
          />
          <ul className="mt-10 space-y-6">
            {benefits.map(({ icon: Icon, title: t, text }) => (
              <li key={t} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-accent shadow-[var(--shadow-soft)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-[0.9375rem] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          {dealer.hotline && (
            <a
              href={telHref(dealer.hotline)}
              className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4"
            >
              <Phone className="size-5 text-accent" aria-hidden />
              <span>
                <span className="block text-xs text-muted">Hotline tư vấn</span>
                <span className="text-lg font-bold text-brand">{dealer.hotline}</span>
              </span>
            </a>
          )}
        </div>
        <div className="min-w-0 lg:col-span-7">
          <Suspense fallback={<div className="min-h-[640px] rounded-3xl bg-white shadow-[var(--shadow-lift)]" aria-busy="true" />}>
            <QuoteForm defaultVehicle={defaultVehicle} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
