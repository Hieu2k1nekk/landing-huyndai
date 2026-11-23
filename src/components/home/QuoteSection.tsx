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
  anchorId = QUOTE_ANCHOR,
}: {
  defaultVehicle?: string
  headingAs?: 'h1' | 'h2'
  title?: string
  /** id của section; trang chủ đã có #bao-gia ở khu trả góp nên dùng id khác */
  anchorId?: string
}) {
  return (
    <section id={anchorId} aria-labelledby="quote-title" className="section-y scroll-mt-16 bg-surface">
      <div className="container-page">
        <SectionHeading
          id="quote-title"
          as={headingAs}
          align="center"
          eyebrow="Báo giá & tư vấn"
          title={title}
          description="Liên hệ để chuyên viên tư vấn gửi báo giá chi tiết cùng chương trình bán hàng đang áp dụng."
        />

        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title: t, text }, i) => (
            <li
              key={t}
              className="relative rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <span className="absolute top-6 right-7 text-sm font-bold text-brand/15 tabular-nums" aria-hidden>
                0{i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-xl bg-brand/[0.06] text-brand">
                <Icon className="size-6" aria-hidden />
              </span>
              <p className="mt-6 text-lg font-semibold text-ink">{t}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-3xl">
          <Suspense fallback={<div className="min-h-[860px] rounded-[var(--radius-panel)] bg-white shadow-[var(--shadow-lift)]" aria-busy="true" />}>
            <QuoteForm defaultVehicle={defaultVehicle} />
          </Suspense>
        </div>

        {dealer.hotline && (
          <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-5 rounded-[var(--radius-panel)] bg-brand px-7 py-8 text-center text-white sm:flex-row sm:px-10 sm:text-left">
            <div>
              <p className="text-lg font-semibold">Cần báo giá ngay hôm nay?</p>
              <p className="mt-1 text-sm text-white/70">Gọi hotline để được chuyên viên tư vấn trực tiếp.</p>
            </div>
            <a
              href={telHref(dealer.hotline)}
              className="inline-flex items-center gap-3 rounded-[var(--radius-control)] bg-white px-6 py-4 text-brand transition-colors hover:bg-white/90"
            >
              <Phone className="size-5" aria-hidden />
              <span className="text-xl font-bold tracking-tight tabular-nums">{dealer.hotline}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
