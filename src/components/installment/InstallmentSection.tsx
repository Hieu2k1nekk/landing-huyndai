import { lazy, Suspense, useEffect, useId, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { ArrowRight, Info, Phone, X } from 'lucide-react'
import { QUOTE_ANCHOR } from '@/data/navigation'
import { getStartingPrice, getVehicle, vehicles } from '@/data/vehicles'
import { dealer, telHref } from '@/config/site'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { borderFor, control, SelectContent, SelectTrigger } from '@/components/ui/FormControls'
import { QUOTE_EVENT, type QuoteIntent } from '@/components/forms/QuoteLink'
import {
  calculateInstallment,
  formatPercent,
  formatTerm,
  formatVnd,
  INSTALLMENT_LIMITS as LIM,
  type InstallmentPlan,
} from '@/utils/installment'
import { formatPriceShort } from '@/utils/format'
import { cn } from '@/utils/cn'
import { RangeSlider } from './RangeSlider'

// Form tư vấn (zod + react-hook-form) chỉ tải khi mở hộp thoại
const QuoteForm = lazy(() => import('@/components/forms/QuoteForm').then((m) => ({ default: m.QuoteForm })))

const CUSTOM = '__custom'
const STARTING = '__start'
const vehicleItems = [
  ...vehicles.map((v) => ({ value: v.slug, label: v.name })),
  { value: CUSTOM, label: 'Xe khác / tự nhập giá' },
]

/** Giá tham khảo theo dữ liệu bảng giá: phiên bản cụ thể hoặc giá khởi điểm */
const priceOf = (slug: string, version: string) => {
  const v = getVehicle(slug)
  if (!v) return null
  return version ? (v.versions.find((x) => x.name === version)?.price ?? null) : getStartingPrice(v)
}

const firstPriced = vehicles.find((v) => getStartingPrice(v) != null)?.slug ?? ''
const digits = (s: string) => Number(s.replace(/\D/g, '').slice(0, 12)) || 0

type DialogState = { open: boolean; key: number; intent?: QuoteIntent; plan?: InstallmentPlan }

/**
 * Section "Trả góp – Ước tính trả góp hàng tháng" (thay khu vực báo giá cũ, giữ anchor #bao-gia).
 * - Trái: giá xe, tỷ lệ trả trước, thời hạn, lãi suất; phải: kết quả cập nhật tức thì.
 * - "Đăng ký tư vấn trả góp" mở form tư vấn (hộp thoại) kèm toàn bộ phương án.
 * - Các nút "Báo giá" khác trên trang cũng mở hộp thoại này (xem focusQuoteForm).
 */
export function InstallmentSection({
  defaultVehicle,
  headingAs = 'h2',
  title = 'Ước tính trả góp hàng tháng',
}: {
  defaultVehicle?: string
  headingAs?: 'h1' | 'h2'
  title?: string
}) {
  const uid = useId()
  const id = (n: string) => `${uid}-${n}`

  const initialVehicle = defaultVehicle && getVehicle(defaultVehicle) ? defaultVehicle : firstPriced
  const [vehicle, setVehicle] = useState(initialVehicle)
  const [version, setVersion] = useState('')
  const [price, setPrice] = useState(() => priceOf(initialVehicle, '') ?? 0)
  const [downPct, setDownPct] = useState(LIM.downPayment.default)
  const [term, setTerm] = useState(LIM.defaultTerm)
  const [rate, setRate] = useState(LIM.rate.default)
  const [dialog, setDialog] = useState<DialogState>({ open: false, key: 0 })

  const selected = getVehicle(vehicle)
  const priceValid = price >= LIM.price.min && price <= LIM.price.max
  const result = useMemo(
    () => calculateInstallment({ carPrice: priceValid ? price : 0, downPaymentPercent: downPct, termMonths: term, annualRatePercent: rate }),
    [price, priceValid, downPct, term, rate],
  )

  const pickVehicle = (slug: string) => {
    if (slug === CUSTOM) {
      setVehicle('')
      setVersion('')
      return
    }
    setVehicle(slug)
    setVersion('')
    const p = priceOf(slug, '')
    if (p != null) setPrice(p)
  }
  const pickVersion = (name: string) => {
    const ver = name === STARTING ? '' : name
    setVersion(ver)
    const p = priceOf(vehicle, ver)
    if (p != null) setPrice(p)
  }

  // Nút "Báo giá" ở nơi khác trên trang -> mở form tư vấn dạng hộp thoại (không cuộn trang)
  useEffect(() => {
    const onIntent = (e: Event) => {
      e.preventDefault()
      const intent = (e as CustomEvent<QuoteIntent>).detail ?? {}
      setDialog((d) => ({ open: true, key: d.key + 1, intent }))
    }
    window.addEventListener(QUOTE_EVENT, onIntent)
    return () => window.removeEventListener(QUOTE_EVENT, onIntent)
  }, [])

  const openConsult = () =>
    setDialog((d) => ({
      open: true,
      key: d.key + 1,
      intent: selected ? { vehicle: selected.slug, version: version || undefined } : {},
      plan: { ...result, vehicle: selected?.slug, version: version || undefined },
    }))

  const rows: [string, string][] = [
    ['Giá xe', priceValid ? formatVnd(result.carPrice) : '—'],
    [`Trả trước (${downPct}%)`, priceValid ? formatVnd(result.downPayment) : '—'],
    ['Số tiền vay', priceValid ? formatVnd(result.loanAmount) : '—'],
    ['Thời hạn vay', formatTerm(term)],
    ['Lãi suất dự kiến', `${formatPercent(rate)}%/năm`],
    ['Tổng lãi ước tính', priceValid ? formatVnd(result.totalInterest) : '—'],
  ]

  return (
    <section id={QUOTE_ANCHOR} aria-labelledby="installment-title" className="section-y scroll-mt-16 bg-surface">
      <div className="container-page">
        <SectionHeading
          id="installment-title"
          as={headingAs}
          eyebrow="Trả góp"
          title={title}
          description="Kéo thanh trượt để xem ngay khoản trả hằng tháng theo giá xe, tỷ lệ trả trước, thời hạn và lãi suất bạn dự kiến."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Thông số ---------- */}
          <div className="min-w-0 rounded-[var(--radius-panel)] bg-white p-6 shadow-[var(--shadow-lift)] sm:p-10 lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={id('vehicle')} className="mb-2 block text-sm font-semibold text-ink">
                  Mẫu xe
                </label>
                <Select.Root value={vehicle || CUSTOM} onValueChange={pickVehicle}>
                  <SelectTrigger id={id('vehicle')} placeholder="Chọn mẫu xe" />
                  <SelectContent items={vehicleItems} />
                </Select.Root>
              </div>
              <div>
                <label htmlFor={id('version')} className="mb-2 block text-sm font-semibold text-ink">
                  Phiên bản
                </label>
                <Select.Root value={selected ? version || STARTING : ''} onValueChange={pickVersion} disabled={!selected}>
                  <SelectTrigger id={id('version')} placeholder="Không áp dụng" />
                  <SelectContent
                    items={[
                      { value: STARTING, label: 'Giá khởi điểm' },
                      ...(selected?.versions
                        .filter((x) => x.price != null)
                        .map((x) => ({ value: x.name, label: `${x.name} – ${formatPriceShort(x.price)}` })) ?? []),
                    ]}
                  />
                </Select.Root>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={id('price')} className="mb-2 block text-sm font-semibold text-ink">
                  Giá xe (VNĐ)
                </label>
                <div className="relative">
                  <input
                    id={id('price')}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={price ? price.toLocaleString('vi-VN') : ''}
                    onChange={(e) => setPrice(digits(e.target.value))}
                    placeholder="Ví dụ: 650.000.000"
                    aria-invalid={!priceValid}
                    aria-describedby={id('price-hint')}
                    className={cn(control, borderFor(!priceValid && price > 0), 'pr-12 text-lg font-semibold tabular-nums')}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" aria-hidden>
                    ₫
                  </span>
                </div>
                <p id={id('price-hint')} className={cn('mt-2 text-xs', priceValid ? 'text-muted' : 'text-red-600')}>
                  {priceValid
                    ? selected
                      ? 'Đã điền giá tham khảo theo bảng giá – có thể sửa thành giá lăn bánh hoặc giá bạn được báo.'
                      : 'Nhập giá xe bạn quan tâm.'
                    : `Vui lòng nhập giá xe từ ${formatPriceShort(LIM.price.min)} đến ${formatPriceShort(LIM.price.max)}.`}
                </p>
              </div>
            </div>

            <div className="my-8 h-px bg-line" aria-hidden />

            <div className="grid gap-8">
              <RangeSlider
                id={id('down')}
                label="Tỷ lệ trả trước"
                value={downPct}
                {...LIM.downPayment}
                onChange={setDownPct}
                display={`${downPct}%`}
                valueText={`${downPct} phần trăm`}
                minLabel={`${LIM.downPayment.min}%`}
                maxLabel={`${LIM.downPayment.max}%`}
              >
                <p className="mt-1 text-sm text-muted tabular-nums">
                  Trả trước {priceValid ? <strong className="text-ink">{formatVnd(result.downPayment)}</strong> : '—'}
                </p>
              </RangeSlider>

              <fieldset>
                <legend className="flex w-full items-end justify-between gap-4">
                  <span className="text-sm font-semibold text-ink">Thời hạn vay</span>
                  <span className="text-[1.75rem] leading-none font-bold tracking-tight text-brand tabular-nums">
                    {term} <span className="text-base font-semibold">tháng</span>
                  </span>
                </legend>
                <div className="mt-4 grid grid-cols-4 gap-1.5 rounded-[var(--radius-control)] bg-surface p-1 sm:grid-cols-8">
                  {LIM.terms.map((m) => (
                    <label key={m} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name={id('term')}
                        value={m}
                        checked={term === m}
                        onChange={() => setTerm(m)}
                        className="peer sr-only"
                        aria-label={formatTerm(m)}
                      />
                      <span className="flex h-11 flex-col items-center justify-center rounded-[calc(var(--radius-control)-0.25rem)] text-[0.9375rem] font-semibold text-muted tabular-nums transition-all peer-checked:bg-white peer-checked:text-brand peer-checked:shadow-[var(--shadow-soft)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent hover:text-ink">
                        {m}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">Đơn vị: tháng · {formatTerm(term)}</p>
              </fieldset>

              <RangeSlider
                id={id('rate')}
                label="Lãi suất dự kiến"
                value={rate}
                {...LIM.rate}
                onChange={setRate}
                display={
                  <>
                    {formatPercent(rate)}%<span className="text-base font-semibold">/năm</span>
                  </>
                }
                valueText={`${formatPercent(rate)} phần trăm một năm`}
                minLabel={`${LIM.rate.min}%`}
                maxLabel={`${LIM.rate.max}%`}
              >
                <p className="mt-1 text-sm text-muted">Lãi suất giả định cố định suốt kỳ hạn – tùy ngân hàng và thời điểm.</p>
              </RangeSlider>
            </div>
          </div>

          {/* ---------- Kết quả ---------- */}
          <div className="min-w-0 lg:col-span-5">
            <div className="showroom-panel overflow-hidden rounded-[var(--radius-panel)] p-6 text-white shadow-[var(--shadow-lift)] sm:p-10 lg:sticky lg:top-28">
              <p className="text-sm font-medium text-white/70">Trả góp ước tính mỗi tháng</p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-2 tabular-nums" aria-live="polite" aria-atomic>
                <output className="text-[2.5rem] leading-none font-bold tracking-tight sm:text-5xl" htmlFor={`${id('down')} ${id('rate')} ${id('price')}`}>
                  {priceValid ? result.monthlyPayment.toLocaleString('vi-VN') : '—'}
                </output>
                <span className="text-lg font-semibold text-white/80">₫/tháng</span>
              </p>

              <dl className="mt-8 divide-y divide-white/12 border-y border-white/12">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-[0.9375rem] text-white/70">{k}</dt>
                    <dd className="text-right font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>

              {selected && (
                <p className="mt-4 text-sm text-white/70">
                  Đang tính cho <strong className="text-white">{selected.name}</strong>
                  {version ? ` – ${version}` : ' (giá khởi điểm)'}
                </p>
              )}

              <Button variant="light" size="lg" className="mt-6 w-full" onClick={openConsult} disabled={!priceValid}>
                Đăng ký tư vấn trả góp <ArrowRight className="size-4" aria-hidden />
              </Button>
              {dealer.hotline && (
                <a href={telHref(dealer.hotline)} className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-white/85 hover:text-white">
                  <Phone className="size-4" aria-hidden /> {dealer.hotline}
                </a>
              )}

              <p className="mt-6 flex gap-2 text-xs leading-relaxed text-white/60">
                <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                <span>
                  Số liệu chỉ mang tính ước tính, tính theo phương pháp trả đều hằng tháng trên dư nợ giảm dần với lãi suất giả
                  định cố định; chưa gồm chi phí lăn bánh, bảo hiểm và phí của ngân hàng. Đây không phải cam kết cho vay –
                  hạn mức, lãi suất và kỳ hạn thực tế do ngân hàng quyết định sau thẩm định.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Form tư vấn (hộp thoại) ---------- */}
      <Dialog.Root open={dialog.open} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}>
        <Dialog.Portal>
          <Dialog.Overlay className="anim-overlay fixed inset-0 z-50 grid grid-cols-[minmax(0,1fr)] items-end overflow-y-auto bg-brand-900/45 backdrop-blur-sm sm:items-center sm:p-6">
            <Dialog.Content
              aria-describedby={undefined}
              className="anim-dialog relative mx-auto w-full max-w-3xl min-w-0 rounded-t-[1.75rem] bg-white shadow-2xl outline-none sm:rounded-[var(--radius-panel)]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-[1.75rem] border-b border-line bg-white/95 px-6 py-4 backdrop-blur sm:rounded-t-[var(--radius-panel)] sm:px-10">
                <Dialog.Title className="text-lg font-bold tracking-tight sm:text-xl">
                  {dialog.plan ? 'Đăng ký tư vấn trả góp' : 'Nhận báo giá & tư vấn'}
                </Dialog.Title>
                <Dialog.Close className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-surface" aria-label="Đóng">
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </div>
              <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
                {dialog.key > 0 && (
                  <QuoteForm
                    key={dialog.key}
                    defaultVehicle={defaultVehicle}
                    intent={dialog.intent}
                    installment={dialog.plan}
                    className="rounded-none p-6 pb-8 shadow-none sm:p-10"
                  />
                )}
              </Suspense>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
