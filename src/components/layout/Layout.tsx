import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { FloatingContact, hasMobileContactBar } from './FloatingContact'

/** Cuộn lên đầu khi đổi trang; cuộn tới #hash nếu có */
function ScrollManager() {
  const { pathname, hash, search } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    const isFirst = first.current
    first.current = false
    if (isFirst && !hash) return // giữ scroll restoration của trình duyệt
    if (hash) {
      // Đợi nội dung (có thể lazy) render xong
      const id = decodeURIComponent(hash.slice(1))
      let tries = 0
      const tick = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView()
        else if (tries++ < 20) setTimeout(tick, 50)
      }
      tick()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, search])
  return null
}

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Bỏ qua điều hướng
      </a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {/* chừa chỗ cho thanh liên hệ cố định dưới đáy (mobile) để không che nội dung cuối footer */}
      {hasMobileContactBar && <div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-brand-900 sm:hidden" />}
      <FloatingContact />
    </>
  )
}
