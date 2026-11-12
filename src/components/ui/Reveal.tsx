import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Fade-in nhẹ khi phần tử xuất hiện trong viewport.
 * - Chỉ ẩn ban đầu khi <html class="js"> (crawler/no-JS luôn thấy nội dung).
 * - Tôn trọng prefers-reduced-motion (xử lý trong CSS).
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className,
  children,
  id,
}: {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal=""
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
