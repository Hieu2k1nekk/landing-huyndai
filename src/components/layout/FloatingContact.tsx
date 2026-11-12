import { useState } from 'react'
import { ArrowUp, MessageSquareText, Phone, X } from 'lucide-react'
import { dealer, telHref } from '@/config/site'
import { useScrolled } from '@/hooks/useScrolled'
import { MessengerIcon, ZaloIcon } from '@/components/ui/SocialIcons'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { cn } from '@/utils/cn'

/**
 * Nhóm liên hệ nổi góc phải dưới.
 * - Desktop: hiển thị dạng cột nút.
 * - Mobile: thu gọn thành 1 nút "Liên hệ" để không che nội dung, chạm để mở.
 * - Nút chỉ hiển thị khi đã cấu hình hotline/Zalo/Messenger (không tạo số giả).
 */
export function FloatingContact() {
  const scrolled = useScrolled(600)
  const [open, setOpen] = useState(false)

  const actions = [
    dealer.hotline && {
      key: 'call',
      href: telHref(dealer.hotline),
      label: `Gọi ${dealer.hotline}`,
      icon: <Phone className="size-5" aria-hidden />,
      className: 'bg-brand text-white',
      external: false,
    },
    dealer.social.zalo && {
      key: 'zalo',
      href: dealer.social.zalo,
      label: 'Chat Zalo',
      icon: <ZaloIcon className="size-6" />,
      className: 'bg-[#0068FF] text-white',
      external: true,
    },
    dealer.social.messenger && {
      key: 'messenger',
      href: dealer.social.messenger,
      label: 'Chat Messenger',
      icon: <MessengerIcon className="size-5" />,
      className: 'bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white',
      external: true,
    },
  ].filter(Boolean) as {
    key: string
    href: string
    label: string
    icon: React.ReactNode
    className: string
    external: boolean
  }[]

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  const btn =
    'grid size-12 place-items-center rounded-full shadow-[0_8px_24px_-8px_rgb(0_20_50/0.45)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95'

  return (
    <div className="fixed right-3 bottom-4 z-30 flex flex-col items-end gap-2.5 sm:right-5 sm:bottom-6">
      {actions.length === 0 && (
        <QuoteLink
          className={cn(btn, 'h-12 w-auto gap-2 px-5 text-sm')}
          variant="accent"
          size="sm"
        >
          <MessageSquareText className="size-5" aria-hidden />
          <span className="hidden sm:inline">Nhận báo giá</span>
          <span className="sr-only sm:hidden">Nhận báo giá</span>
        </QuoteLink>
      )}
      {actions.length > 0 && (
        <>
          <ul
            id="floating-contact-list"
            className={cn(
              'flex flex-col items-end gap-2.5 transition-all duration-300',
              open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0 sm:visible sm:translate-y-0 sm:opacity-100',
            )}
          >
            {actions.map((a) => (
              <li key={a.key}>
                <a
                  href={a.href}
                  aria-label={a.label}
                  title={a.label}
                  {...(a.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={cn(btn, a.className)}
                >
                  {a.icon}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="floating-contact-list"
            aria-label={open ? 'Đóng liên hệ nhanh' : 'Mở liên hệ nhanh'}
            className={cn(btn, 'bg-accent text-white sm:hidden')}
          >
            {open ? <X className="size-5" aria-hidden /> : <MessageSquareText className="size-5" aria-hidden />}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={toTop}
        aria-label="Lên đầu trang"
        className={cn(
          btn,
          'size-11 border border-line bg-white text-brand',
          scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        )}
        tabIndex={scrolled ? 0 : -1}
      >
        <ArrowUp className="size-5" aria-hidden />
      </button>
    </div>
  )
}
