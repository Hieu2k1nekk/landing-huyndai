import type { MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router'
import { QUOTE_ANCHOR } from '@/data/navigation'
import { buttonClass } from '@/components/ui/Button'

export const QUOTE_EVENT = 'quote:select'

/** Ý định báo giá: mẫu xe + (tuỳ chọn) màu ngoại thất & phiên bản khách đang xem */
export interface QuoteIntent {
  vehicle?: string
  color?: string
  version?: string
}

/**
 * Trang hiện tại có khu vực #bao-gia:
 *  - Form nằm ngay trên trang (trang Liên hệ) -> chọn sẵn xe/màu/phiên bản & cuộn tới form.
 *  - Khu vực bảng tính trả góp -> nó gọi preventDefault() và tự mở form tư vấn dạng hộp thoại (không cuộn).
 */
export function focusQuoteForm(intent: QuoteIntent = {}) {
  const el = document.getElementById(QUOTE_ANCHOR)
  if (!el) return false
  const handled = !window.dispatchEvent(new CustomEvent<QuoteIntent>(QUOTE_EVENT, { detail: intent, cancelable: true }))
  if (handled) return true
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  return true
}

export function quoteHref({ vehicle, color, version }: QuoteIntent) {
  const q = new URLSearchParams()
  if (vehicle) q.set('xe', vehicle)
  if (vehicle && color) q.set('mau', color)
  if (vehicle && version) q.set('phien-ban', version)
  const qs = q.toString()
  return `/lien-he${qs ? `?${qs}` : ''}#${QUOTE_ANCHOR}`
}

/**
 * Link "Nhận báo giá":
 *  - Trang hiện tại có form -> chọn sẵn xe (+ màu, phiên bản) & cuộn tới form.
 *  - Không có form -> /lien-he?xe=<slug>&mau=<màu>&phien-ban=<phiên bản>#bao-gia.
 */
export function QuoteLink({
  vehicle,
  color,
  version,
  children,
  variant = 'primary',
  size = 'md',
  className,
  onNavigate,
}: QuoteIntent & {
  children: ReactNode
  variant?: Parameters<typeof buttonClass>[0]
  size?: Parameters<typeof buttonClass>[1]
  className?: string
  onNavigate?: () => void
}) {
  const onClick = (e: MouseEvent) => {
    onNavigate?.()
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    if (focusQuoteForm({ vehicle, color, version })) e.preventDefault()
  }
  return (
    <Link to={quoteHref({ vehicle, color, version })} onClick={onClick} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  )
}
