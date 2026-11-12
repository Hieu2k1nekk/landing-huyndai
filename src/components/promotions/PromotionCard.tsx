import { Car, Gift, Receipt, Tag, Wallet, type LucideIcon } from 'lucide-react'
import type { Promotion } from '@/types'
import { getVehicle } from '@/data/vehicles'
import { cn } from '@/utils/cn'

const ICONS: Record<Promotion['icon'], LucideIcon> = {
  tag: Tag,
  receipt: Receipt,
  wallet: Wallet,
  gift: Gift,
  car: Car,
}

export function PromotionCard({
  promo,
  tone = 'dark',
  className,
  headingLevel: Heading = 'h3',
}: {
  promo: Promotion
  tone?: 'dark' | 'light'
  className?: string
  headingLevel?: 'h2' | 'h3'
}) {
  const Icon = ICONS[promo.icon]
  const dark = tone === 'dark'
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-[var(--radius-card)] border p-6 transition-colors',
        dark ? 'border-white/12 bg-white/[0.04] hover:bg-white/[0.07]' : 'border-line bg-white hover:border-brand/30',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'grid size-11 place-items-center rounded-xl',
            dark ? 'bg-white/10 text-sky-300' : 'bg-accent/10 text-accent',
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        {promo.isSample && (
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide uppercase',
              dark ? 'bg-amber-300/15 text-amber-200' : 'bg-amber-50 text-amber-700',
            )}
          >
            Cần cập nhật
          </span>
        )}
      </div>
      <Heading className={cn('mt-5 text-lg font-bold', dark && 'text-white')}>{promo.title}</Heading>
      {promo.value && <p className={cn('mt-1 text-2xl font-bold', dark ? 'text-sky-300' : 'text-brand')}>{promo.value}</p>}
      <p className={cn('mt-2 text-[0.9375rem]', dark ? 'text-white/65' : 'text-muted')}>{promo.description}</p>
      {(promo.appliesTo?.length || promo.validUntil) && (
        <div className={cn('mt-auto pt-5 text-sm', dark ? 'text-white/55' : 'text-muted')}>
          {promo.appliesTo?.length ? (
            <p>Áp dụng: {promo.appliesTo.map((s) => getVehicle(s)?.model ?? s).join(', ')}</p>
          ) : null}
          {promo.validUntil && <p>Thời hạn: {promo.validUntil}</p>}
        </div>
      )}
    </article>
  )
}
