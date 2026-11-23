import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Select from '@radix-ui/react-select'
import { AlertCircle, Check, CheckCircle2, Loader2, Phone, RotateCcw } from 'lucide-react'
import { useLocation } from 'react-router'
import { getVehicle, vehicles } from '@/data/vehicles'
import { dealer, telHref } from '@/config/site'
import { LeadServiceNotConfiguredError, submitLead } from '@/services/leadService'
import { cn } from '@/utils/cn'
import { CarImage } from '@/components/ui/CarImage'
import { Button } from '@/components/ui/Button'
import { borderFor, control, SelectContent, SelectTrigger } from '@/components/ui/FormControls'
import { QUOTE_EVENT, type QuoteIntent } from './QuoteLink'
import type { InstallmentPlan } from '@/utils/installment'
import { Captcha, CAPTCHA_ENABLED } from './Captcha'
import { quoteSchema, type QuoteFormInput, type QuoteFormValues } from './quoteSchema'

type Status =
  | { kind: 'idle' }
  | { kind: 'success'; name: string; vehicle: string }
  | { kind: 'error'; reason: 'not-configured' | 'network' }

/** Giá trị đại diện cho "Tất cả phiên bản" (Radix Select không cho item rỗng) */
const ALL_VERSIONS = '__all'


function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  )
}

function Label({ htmlFor, children, required }: { htmlFor?: string; children: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-ink">
      {children}
      {required && (
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      )}
    </label>
  )
}

function StepTitle({ n, children }: { n: string; children: string }) {
  return (
    <legend className="mb-5 flex items-center gap-3 text-lg font-bold tracking-tight">
      <span className="grid size-8 place-items-center rounded-full bg-brand text-xs text-white tabular-nums">{n}</span>
      {children}
    </legend>
  )
}

export function QuoteForm({
  defaultVehicle,
  intent,
  installment,
  className,
}: {
  defaultVehicle?: string
  /** Xe/màu/phiên bản cần chọn sẵn khi form được mở (form trong hộp thoại) */
  intent?: QuoteIntent
  /** Phương án trả góp ước tính từ bảng tính – hiển thị & gửi kèm yêu cầu */
  installment?: InstallmentPlan
  className?: string
}) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const location = useLocation()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const pickerRef = useRef<HTMLDivElement>(null)
  /** Đổi key để dựng lại captcha (token chỉ dùng được một lần) */
  const [captchaKey, setCaptchaKey] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    control: formControl,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormInput, unknown, QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      phone: '',
      vehicle: defaultVehicle ?? '',
      version: '',
      color: '',
      paymentMethod: installment ? 'tra-gop' : 'tra-thang',
      captchaToken: '',
      website: '',
    },
  })

  const onCaptcha = useCallback((t: string) => setValue('captchaToken', t, { shouldValidate: !!t }), [setValue])

  const vehicleSlug = useWatch({ control: formControl, name: 'vehicle' })
  const selected = vehicleSlug ? getVehicle(vehicleSlug) : undefined


  // Phiên bản: đổi dòng xe -> reset, TRỪ khi đi kèm yêu cầu báo giá cho đúng phiên bản của xe đó
  const pendingVersion = useRef<{ slug: string; version: string } | null>(null)
  useEffect(() => {
    const p = pendingVersion.current
    setValue('version', p && p.slug === vehicleSlug ? p.version : '')
    pendingVersion.current = null
  }, [vehicleSlug, setValue])

  /** Áp dụng xe + màu + phiên bản (từ nút báo giá hoặc URL) */
  const applyIntent = useCallback(
    ({ vehicle, version }: QuoteIntent, validate: boolean) => {
      const v = vehicle ? getVehicle(vehicle) : undefined
      if (!v) return
      const ver = version && v.versions.some((x) => x.name === version) ? version : ''
      pendingVersion.current = { slug: v.slug, version: ver }
      setValue('vehicle', v.slug, { shouldValidate: validate })
      setValue('version', ver)
    },
    [setValue],
  )

  // Mobile: cuộn ngang danh sách xe để thẻ đang chọn luôn trong tầm nhìn (không cuộn trang)
  useEffect(() => {
    const scroller = pickerRef.current
    const card = scroller?.querySelector<HTMLElement>('[data-checked=true]')
    if (!scroller || !card || scroller.scrollWidth <= scroller.clientWidth) return
    const left = card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2
    scroller.scrollTo({ left, behavior: 'smooth' })
  }, [vehicleSlug])

  // Chọn sẵn xe/màu/phiên bản từ ?xe=<slug>&mau=<màu>&phien-ban=<tên> (client-only để không lệch hydration)
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    applyIntent({ vehicle: q.get('xe') ?? undefined, color: q.get('mau') ?? undefined, version: q.get('phien-ban') ?? undefined }, false)
  }, [location.search, applyIntent])

  // Ý định truyền qua props (form mở trong hộp thoại) – chạy sau ?xe= để được ưu tiên
  useEffect(() => {
    if (intent) applyIntent(intent, false)
  }, [intent, applyIntent])

  // Nhận yêu cầu từ các nút "Nhận báo giá" trên cùng trang
  useEffect(() => {
    const onIntent = (e: Event) => {
      setStatus({ kind: 'idle' })
      applyIntent((e as CustomEvent<QuoteIntent>).detail ?? {}, true)
      setTimeout(() => setFocus('fullName'), 450)
    }
    window.addEventListener(QUOTE_EVENT, onIntent)
    return () => window.removeEventListener(QUOTE_EVENT, onIntent)
  }, [applyIntent, setFocus])

  const onSubmit = async (values: QuoteFormValues) => {
    if (values.website) return // bot
    const v = getVehicle(values.vehicle)!
    try {
      await submitLead({
        fullName: values.fullName,
        phone: values.phone,
        vehicle: v.name,
        version: values.version || undefined,
        paymentMethod: values.paymentMethod,
        financing:
          installment && values.paymentMethod === 'tra-gop'
            ? {
                carPrice: installment.carPrice,
                downPaymentPercent: installment.downPaymentPercent,
                downPayment: installment.downPayment,
                loanAmount: installment.loanAmount,
                termMonths: installment.termMonths,
                annualRatePercent: installment.annualRatePercent,
                monthlyPayment: installment.monthlyPayment,
                estimateOnly: true,
              }
            : undefined,
        source: typeof window !== 'undefined' ? window.location.href : location.pathname,
        submittedAt: new Date().toISOString(),
      })
      setStatus({ kind: 'success', name: values.fullName.split(' ').at(-1) ?? values.fullName, vehicle: v.name })
      reset({ ...values, fullName: '', phone: '', captchaToken: '' })
    } catch (err) {
      setValue('captchaToken', '')
      setCaptchaKey((k) => k + 1)
      setStatus({ kind: 'error', reason: err instanceof LeadServiceNotConfiguredError ? 'not-configured' : 'network' })
    }
  }

  const card = cn('rounded-[var(--radius-panel)] bg-white p-6 shadow-[var(--shadow-lift)] sm:p-10', className)

  if (status.kind === 'success') {
    return (
      <div className={cn(card, 'text-center')} role="status" aria-live="polite">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" aria-hidden />
        </div>
        <h3 className="mt-6 text-2xl font-bold">Cảm ơn anh/chị {status.name}!</h3>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Yêu cầu báo giá <strong className="text-ink">{status.vehicle}</strong> đã được ghi nhận. Chuyên viên tư vấn sẽ
          liên hệ với anh/chị trong thời gian sớm nhất.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setStatus({ kind: 'idle' })}>
          <RotateCcw className="size-4" aria-hidden /> Gửi yêu cầu khác
        </Button>
      </div>
    )
  }

  const err = (name: keyof typeof errors) => errors[name]?.message as string | undefined
  const describedBy = (name: string, has: boolean) => (has ? id(`${name}-error`) : undefined)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Form nhận báo giá xe Hyundai" className={card}>
      {/* ---------- Bước 1: xe ---------- */}
      <fieldset className="min-w-0">
        <StepTitle n="01">Chọn mẫu xe</StepTitle>

        <div role="radiogroup" aria-label="Dòng xe quan tâm" aria-required aria-invalid={!!errors.vehicle} aria-describedby={describedBy('vehicle', !!errors.vehicle)}>
          <div
            ref={pickerRef}
            className="no-scrollbar -mx-6 flex snap-x gap-2.5 overflow-x-auto scroll-px-6 px-6 pb-1 sm:-mx-10 sm:scroll-px-10 sm:px-10 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 md:pb-0"
          >
            {vehicles.map((v) => {
              const checked = v.slug === vehicleSlug
              return (
                <label
                  key={v.slug}
                  data-checked={checked}
                  className={cn(
                    'group relative flex w-[7.5rem] shrink-0 cursor-pointer snap-start flex-col items-center rounded-xl border px-2 pt-3 pb-2.5 text-center transition-[border-color,background-color,box-shadow] duration-200 md:w-auto',
                    checked
                      ? 'border-brand bg-brand/[0.04] shadow-[inset_0_0_0_1px_var(--color-brand)]'
                      : cn('bg-white hover:border-ink/25', errors.vehicle ? 'border-red-300' : 'border-line'),
                    'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25',
                  )}
                >
                  <input type="radio" value={v.slug} className="sr-only" {...register('vehicle')} />
                  <CarImage slug={v.slug} alt="" sizes="112px" className="aspect-[2/1] w-full" />
                  <span className={cn('mt-1.5 text-sm font-semibold', checked ? 'text-brand' : 'text-ink')}>{v.model}</span>
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-2 right-2 grid size-4.5 place-items-center rounded-full bg-brand text-white transition-[opacity,transform] duration-200',
                      checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </label>
              )
            })}
          </div>
        </div>
        <FieldError id={id('vehicle-error')} message={err('vehicle')} />

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor={id('version')}>Phiên bản</Label>
            <Controller
              control={formControl}
              name="version"
              render={({ field }) => (
                <Select.Root
                  value={field.value || (selected ? ALL_VERSIONS : '')}
                  onValueChange={(v) => field.onChange(v === ALL_VERSIONS ? '' : v)}
                  onOpenChange={(open) => !open && field.onBlur()}
                  disabled={!selected}
                  name={field.name}
                >
                  <SelectTrigger ref={field.ref} id={id('version')} placeholder="Chọn dòng xe trước" />
                  <SelectContent
                    items={[
                      { value: ALL_VERSIONS, label: 'Tất cả phiên bản' },
                      ...(selected?.versions.map((ver) => ({ value: ver.name, label: ver.name })) ?? []),
                    ]}
                  />
                </Select.Root>
              )}
            />
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-semibold">Hình thức thanh toán</legend>
            <div className="grid h-13 grid-cols-2 gap-1 rounded-[var(--radius-control)] bg-surface p-1">
              {(
                [
                  ['tra-thang', 'Trả thẳng'],
                  ['tra-gop', 'Trả góp'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="relative cursor-pointer">
                  <input type="radio" value={value} className="peer sr-only" {...register('paymentMethod')} />
                  <span className="flex h-full items-center justify-center rounded-[calc(var(--radius-control)-0.25rem)] text-[0.9375rem] font-semibold text-muted transition-all peer-checked:bg-white peer-checked:text-brand peer-checked:shadow-[var(--shadow-soft)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </fieldset>

      <div className="my-8 h-px bg-line sm:my-10" aria-hidden />

      {/* ---------- Bước 2: liên hệ ---------- */}
      <fieldset className="min-w-0">
        <StepTitle n="02">Thông tin liên hệ</StepTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor={id('name')} required>
              Họ và tên
            </Label>
            <input
              id={id('name')}
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              aria-required
              aria-invalid={!!errors.fullName}
              aria-describedby={describedBy('name', !!errors.fullName)}
              className={cn(control, borderFor(!!errors.fullName))}
              {...register('fullName')}
            />
            <FieldError id={id('name-error')} message={err('fullName')} />
          </div>

          <div>
            <Label htmlFor={id('phone')} required>
              Số điện thoại
            </Label>
            <input
              id={id('phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09xx xxx xxx"
              aria-required
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy('phone', !!errors.phone)}
              className={cn(control, borderFor(!!errors.phone))}
              {...register('phone')}
            />
            <FieldError id={id('phone-error')} message={err('phone')} />
          </div>

          {/* Honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
            </label>
          </div>

          {CAPTCHA_ENABLED && (
            <div className="sm:col-span-2">
              <Captcha key={captchaKey} invalid={!!errors.captchaToken} onToken={onCaptcha} />
              <FieldError id={id('captcha-error')} message={err('captchaToken')} />
            </div>
          )}
        </div>
      </fieldset>

      {status.kind === 'error' && (
        <div role="alert" className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            {status.reason === 'not-configured' ? (
              <p>
                Hệ thống nhận yêu cầu trực tuyến đang được cập nhật nên thông tin <strong>chưa được gửi đi</strong>.
                {dealer.hotline ? ' Vui lòng gọi hotline để được báo giá ngay.' : ' Vui lòng thử lại sau.'}
              </p>
            ) : (
              <p>
                Không thể gửi thông tin do lỗi kết nối. Vui lòng kiểm tra mạng và thử lại
                {dealer.hotline ? ' hoặc gọi hotline.' : '.'}
              </p>
            )}
            {dealer.hotline && (
              <a href={telHref(dealer.hotline)} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand">
                <Phone className="size-4" aria-hidden /> {dealer.hotline}
              </a>
            )}
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="mt-8 w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden /> Đang gửi…
          </>
        ) : (
          'Nhận báo giá ngay'
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-muted">Thông tin của bạn được bảo mật và chỉ dùng để tư vấn.</p>
    </form>
  )
}
