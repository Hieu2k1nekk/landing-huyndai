import type { MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router'
import { QUOTE_ANCHOR } from '@/data/navigation'
import { buttonClass } from '@/components/ui/Button'

export const QUOTE_EVENT = 'quote:select'

export interface QuoteIntent {
  vehicle?: string
}

/** Chọn sẵn mẫu xe trong form báo giá đang có trên trang & cuộn tới form */
export function focusQuoteForm(intent: QuoteIntent = {}) {
  const el = document.getElementById(QUOTE_ANCHOR)
  if (!el) return false
  window.dispatchEvent(new CustomEvent<QuoteIntent>(QUOTE_EVENT, { detail: intent }))
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  return true
}

/**
 * Link "Nhận báo giá":
 *  - Trang hiện tại có form -> chọn sẵn xe + cuộn tới form.
 *  - Không có form -> điều hướng sang /lien-he?xe=<slug>#bao-gia.
 */
export function QuoteLink({
  vehicle,
  children,
  variant = 'primary',
  size = 'md',
  className,
  onNavigate,
}: {
  vehicle?: string
  children: ReactNode
  variant?: Parameters<typeof buttonClass>[0]
  size?: Parameters<typeof buttonClass>[1]
  className?: string
  onNavigate?: () => void
}) {
  const to = `/lien-he${vehicle ? `?xe=${vehicle}` : ''}#${QUOTE_ANCHOR}`
  const onClick = (e: MouseEvent) => {
    onNavigate?.()
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    if (focusQuoteForm({ vehicle })) e.preventDefault()
  }
  return (
    <Link to={to} onClick={onClick} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  )
}
