import { useEffect, useId, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Phone, RotateCcw } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { getStartingPrice, getVehicle, vehicles } from '@/data/vehicles'
import { provinces } from '@/data/provinces'
import { dealer, telHref } from '@/config/site'
import { LeadServiceNotConfiguredError, submitLead } from '@/services/leadService'
import { formatPriceShort } from '@/utils/format'
import { cn } from '@/utils/cn'
import { CarImage } from '@/components/ui/CarImage'
import { Button } from '@/components/ui/Button'
import { QUOTE_EVENT, type QuoteIntent } from './QuoteLink'
import { quoteSchema, type QuoteFormInput, type QuoteFormValues } from './quoteSchema'

type Status =
  | { kind: 'idle' }
  | { kind: 'success'; name: string; vehicle: string }
  | { kind: 'error'; reason: 'not-configured' | 'network' }

const fieldBase =
  'peer block w-full rounded-xl border bg-white px-4 text-base text-ink transition-[border-color,box-shadow] outline-none ' +
  'placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/12 disabled:bg-surface'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  )
}

export function QuoteForm({ defaultVehicle, className }: { defaultVehicle?: string; className?: string }) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const location = useLocation()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const {
    register,
    handleSubmit,
    setValue,
    control,
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
      province: '',
      paymentMethod: 'tra-thang',
      consent: false,
      website: '',
    },
  })

  const vehicleSlug = useWatch({ control, name: 'vehicle' })
  const selected = vehicleSlug ? getVehicle(vehicleSlug) : undefined

  // Reset phiên bản khi đổi dòng xe
  useEffect(() => {
    setValue('version', '')
  }, [vehicleSlug, setValue])

  // Chọn sẵn xe từ ?xe=<slug> (client-only để không lệch hydration)
  useEffect(() => {
    const slug = new URLSearchParams(location.search).get('xe')
    if (slug && getVehicle(slug)) setValue('vehicle', slug, { shouldValidate: false })
  }, [location.search, setValue])

  // Nhận yêu cầu từ các nút "Nhận báo giá" trên cùng trang
  useEffect(() => {
    const onIntent = (e: Event) => {
      const { vehicle } = (e as CustomEvent<QuoteIntent>).detail ?? {}
      setStatus({ kind: 'idle' })
      if (vehicle && getVehicle(vehicle)) setValue('vehicle', vehicle, { shouldValidate: true })
      setTimeout(() => setFocus('fullName'), 450)
    }
    window.addEventListener(QUOTE_EVENT, onIntent)
    return () => window.removeEventListener(QUOTE_EVENT, onIntent)
  }, [setValue, setFocus])

  const onSubmit = async (values: QuoteFormValues) => {
    if (values.website) return // bot
    const v = getVehicle(values.vehicle)!
    try {
      await submitLead({
        fullName: values.fullName,
        phone: values.phone,
        vehicle: v.name,
        version: values.version || undefined,
        province: values.province,
        paymentMethod: values.paymentMethod,
        source: typeof window !== 'undefined' ? window.location.href : location.pathname,
        submittedAt: new Date().toISOString(),
      })
      setStatus({ kind: 'success', name: values.fullName.split(' ').at(-1) ?? values.fullName, vehicle: v.name })
      reset({ ...values, fullName: '', phone: '', consent: false })
    } catch (err) {
      setStatus({ kind: 'error', reason: err instanceof LeadServiceNotConfiguredError ? 'not-configured' : 'network' })
    }
  }

  if (status.kind === 'success') {
    return (
      <div
        className={cn('rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-lift)] sm:p-10', className)}
        role="status"
        aria-live="polite"
      >
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Form nhận báo giá xe Hyundai"
      className={cn('rounded-3xl bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8', className)}
    >
      {/* Xe đang chọn */}
      <div className="-mx-6 -mt-6 mb-6 flex items-center gap-4 rounded-t-3xl border-b border-line bg-surface px-6 py-4 sm:-mx-8 sm:-mt-8 sm:px-8">
        <div className="w-28 shrink-0 sm:w-32">
          {selected ? (
            <CarImage slug={selected.slug} alt={selected.imageAlt} sizes="128px" className="aspect-[2/1]" />
          ) : (
            <div className="grid aspect-[2/1] place-items-center rounded-lg border border-dashed border-line text-xs text-muted">
              Chọn xe
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Báo giá lăn bánh</p>
          <p className="text-lg leading-snug font-bold text-balance text-brand">{selected ? selected.name : 'Dòng xe bạn quan tâm'}</p>
          {selected && (
            <p className="text-sm text-muted">Giá tham khảo từ {formatPriceShort(getStartingPrice(selected))}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id('name')} className="mb-1.5 block text-sm font-semibold">
            Họ và tên <span className="text-red-600">*</span>
          </label>
          <input
            id={id('name')}
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            aria-invalid={!!errors.fullName}
            aria-describedby={describedBy('name', !!errors.fullName)}
            className={cn(fieldBase, 'h-12', errors.fullName ? 'border-red-400' : 'border-line')}
            {...register('fullName')}
          />
          <FieldError id={id('name-error')} message={err('fullName')} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id('phone')} className="mb-1.5 block text-sm font-semibold">
            Số điện thoại <span className="text-red-600">*</span>
          </label>
          <input
            id={id('phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="09xx xxx xxx"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy('phone', !!errors.phone)}
            className={cn(fieldBase, 'h-12', errors.phone ? 'border-red-400' : 'border-line')}
            {...register('phone')}
          />
          <FieldError id={id('phone-error')} message={err('phone')} />
        </div>

        <div>
          <label htmlFor={id('vehicle')} className="mb-1.5 block text-sm font-semibold">
            Dòng xe quan tâm <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <select
              id={id('vehicle')}
              aria-invalid={!!errors.vehicle}
              aria-describedby={describedBy('vehicle', !!errors.vehicle)}
              className={cn(fieldBase, 'h-12 appearance-none pr-10', errors.vehicle ? 'border-red-400' : 'border-line')}
              {...register('vehicle')}
            >
              <option value="">Chọn dòng xe</option>
              {vehicles.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
          </div>
          <FieldError id={id('vehicle-error')} message={err('vehicle')} />
        </div>

        <div>
          <label htmlFor={id('version')} className="mb-1.5 block text-sm font-semibold">
            Phiên bản
          </label>
          <div className="relative">
            <select
              id={id('version')}
              disabled={!selected}
              className={cn(fieldBase, 'h-12 appearance-none border-line pr-10')}
              {...register('version')}
            >
              <option value="">{selected ? 'Tất cả phiên bản' : 'Chọn dòng xe trước'}</option>
              {selected?.versions.map((ver) => (
                <option key={ver.name} value={ver.name}>
                  {ver.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={id('province')} className="mb-1.5 block text-sm font-semibold">
            Tỉnh/Thành phố đăng ký xe <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <select
              id={id('province')}
              autoComplete="address-level1"
              aria-invalid={!!errors.province}
              aria-describedby={describedBy('province', !!errors.province)}
              className={cn(fieldBase, 'h-12 appearance-none pr-10', errors.province ? 'border-red-400' : 'border-line')}
              {...register('province')}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
          </div>
          <FieldError id={id('province-error')} message={err('province')} />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 block text-sm font-semibold">Nhu cầu mua xe</legend>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface p-1">
            {(
              [
                ['tra-thang', 'Trả thẳng'],
                ['tra-gop', 'Trả góp'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="relative cursor-pointer">
                <input type="radio" value={value} className="peer sr-only" {...register('paymentMethod')} />
                <span className="flex h-11 items-center justify-center rounded-lg text-[0.9375rem] font-semibold text-muted transition-all peer-checked:bg-white peer-checked:text-brand peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-line accent-brand"
              aria-invalid={!!errors.consent}
              aria-describedby={describedBy('consent', !!errors.consent)}
              {...register('consent')}
            />
            <span>
              Tôi đồng ý để showroom liên hệ tư vấn và xử lý thông tin theo{' '}
              <Link to="/chinh-sach-bao-mat" className="font-medium text-accent underline-offset-2 hover:underline">
                Chính sách bảo mật
              </Link>
              .
            </span>
          </label>
          <FieldError id={id('consent-error')} message={err('consent')} />
        </div>
      </div>

      {status.kind === 'error' && (
        <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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

      <Button type="submit" variant="primary" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
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
