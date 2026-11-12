import { useLocation } from 'react-router'
import { ArrowUp, MessageSquareText, Phone } from 'lucide-react'
import { dealer, telHref } from '@/config/site'
import { useScrolled } from '@/hooks/useScrolled'
import { MessengerIcon, ZaloIcon } from '@/components/ui/SocialIcons'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { cn } from '@/utils/cn'

/** Có thanh liên hệ dưới đáy màn hình mobile hay không (Layout dùng để chừa khoảng trống cuối trang) */
export const hasMobileContactBar = Boolean(dealer.hotline || dealer.social.zalo)

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

/**
 * Liên hệ nhanh.
 * - Desktop/tablet (≥ sm): cụm nút nổi góc phải dưới – nút gọi kèm số điện thoại, Zalo, (Messenger), lên đầu trang.
 * - Mobile (< sm): thanh 2 nút "Gọi" + "Zalo" cố định ở đáy màn hình, trượt lên khi người dùng cuộn xuống.
 * - Chỉ hiển thị kênh đã cấu hình trong config/site.ts (không tạo số giả).
 */
export function FloatingContact() {
  const scrolled = useScrolled(600)
  const showBar = useScrolled(120)
  /** Trang chủ: hero đã có CTA riêng -> ẩn cụm nút nổi (desktop) cho tới khi cuộn qua hero */
  const onHero = useLocation().pathname === '/' && !scrolled
  const { hotline } = dealer
  const { zalo, messenger } = dealer.social

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  const shadow = 'shadow-[0_8px_24px_-8px_rgb(0_20_50/0.45)]'
  const round = cn(
    'grid size-12 place-items-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 active:scale-95',
    shadow,
  )

  return (
    <>
      {/* Desktop / tablet */}
      <div
        className={cn(
          'fixed right-5 bottom-6 z-30 hidden flex-col items-end gap-2.5 transition-[opacity,transform,visibility] duration-300 sm:flex',
          onHero && 'invisible translate-y-3 opacity-0',
        )}
      >
        {messenger && (
          <a href={messenger} {...ext} aria-label="Chat Messenger" title="Chat Messenger" className={cn(round, 'bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white')}>
            <MessengerIcon className="size-5" />
          </a>
        )}
        {zalo && (
          <a href={zalo} {...ext} aria-label="Chat Zalo" title="Chat Zalo" className={cn(round, 'bg-[#0068FF] text-white')}>
            <ZaloIcon className="size-6" />
          </a>
        )}
        {hotline ? (
          <a
            href={telHref(hotline)}
            aria-label={`Gọi ${hotline}`}
            title={`Gọi ${hotline}`}
            className={cn(round, 'relative bg-brand text-white ring-2 ring-white')}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-duration:2.2s]" aria-hidden />
            <Phone className="relative size-5 animate-[ring_2.4s_ease-in-out_infinite]" aria-hidden />
          </a>
        ) : (
          !zalo && (
            <QuoteLink className={cn('h-12 gap-2 rounded-full px-5 text-sm', shadow)} variant="accent" size="sm">
              <MessageSquareText className="size-5" aria-hidden />
              Nhận báo giá
            </QuoteLink>
          )
        )}
        <button
          type="button"
          onClick={toTop}
          aria-label="Lên đầu trang"
          tabIndex={scrolled ? 0 : -1}
          className={cn(
            round,
            'size-11 border border-line bg-white text-brand',
            scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
          )}
        >
          <ArrowUp className="size-5" aria-hidden />
        </button>
      </div>

      {/* Mobile: thanh liên hệ dưới đáy, hiện khi cuộn xuống */}
      {hasMobileContactBar && (
        <div
          role="region"
          aria-label="Liên hệ nhanh"
          className={cn(
            'fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(0_20_50/0.25)] backdrop-blur-md transition-[transform,visibility] duration-300 ease-[var(--ease-out-soft)] sm:hidden',
            showBar ? 'visible translate-y-0' : 'invisible translate-y-full',
          )}
        >
          <div className={cn('grid gap-2.5', hotline && zalo ? 'grid-cols-[1.35fr_1fr]' : 'grid-cols-1')}>
            {hotline && (
              <a
                href={telHref(hotline)}
                aria-label={`Gọi ${hotline}`}
                tabIndex={showBar ? 0 : -1}
                className="flex h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand text-[0.9375rem] font-bold text-white tabular-nums active:scale-[0.98]"
              >
                <Phone className="size-[1.125rem] animate-[ring_2.4s_ease-in-out_infinite]" aria-hidden />
                {hotline}
              </a>
            )}
            {zalo && (
              <a
                href={zalo}
                {...ext}
                tabIndex={showBar ? 0 : -1}
                className="flex h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[#0068FF] text-[0.9375rem] font-bold text-white active:scale-[0.98]"
              >
                <ZaloIcon className="size-6" />
                Chat Zalo
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}
