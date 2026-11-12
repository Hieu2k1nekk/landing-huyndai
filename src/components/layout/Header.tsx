import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, Phone, X, ArrowRight } from 'lucide-react'
import { mainNav } from '@/data/navigation'
import { dealer, telHref } from '@/config/site'
import { useScrolled } from '@/hooks/useScrolled'
import { Logo } from '@/components/ui/Logo'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { cn } from '@/utils/cn'

export function Header() {
  const scrolled = useScrolled(8)
  const [open, setOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-[box-shadow,border-color] duration-300 supports-[backdrop-filter]:bg-white/80',
        scrolled ? 'border-line shadow-[0_6px_24px_-12px_rgb(0_44_95/0.18)]' : 'border-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link to="/" aria-label="Hyundai Showroom – Trang chủ" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative inline-flex h-10 items-center px-3 text-[0.9375rem] font-medium transition-colors',
                      'after:absolute after:inset-x-3 after:-bottom-[0.9rem] after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300',
                      isActive ? 'text-brand after:scale-x-100' : 'text-ink/80 hover:text-brand',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {dealer.hotline ? (
            <a
              href={telHref(dealer.hotline)}
              className="hidden items-center gap-2.5 rounded-full px-2 py-1 text-brand transition-colors hover:text-accent md:inline-flex"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface">
                <Phone className="size-4" aria-hidden />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[0.6875rem] font-medium tracking-wide text-muted uppercase">Hotline</span>
                <span className="text-sm font-bold">{dealer.hotline}</span>
              </span>
            </a>
          ) : null}
          <QuoteLink size="sm" className="hidden sm:inline-flex">
            Nhận tư vấn
          </QuoteLink>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface lg:hidden"
              aria-label="Mở menu"
            >
              <Menu className="size-6" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="anim-overlay fixed inset-0 z-50 bg-brand-900/40 backdrop-blur-sm" />
              <Dialog.Content
                className="anim-sheet fixed inset-y-0 right-0 z-50 flex w-[min(88vw,22rem)] flex-col bg-white shadow-2xl outline-none"
                aria-describedby={undefined}
              >
                <div className="flex h-16 items-center justify-between border-b border-line px-5">
                  <Dialog.Title className="sr-only">Menu điều hướng</Dialog.Title>
                  <Logo />
                  <Dialog.Close className="grid size-11 place-items-center rounded-full hover:bg-surface" aria-label="Đóng menu">
                    <X className="size-6" aria-hidden />
                  </Dialog.Close>
                </div>
                <nav aria-label="Điều hướng di động" className="flex-1 overflow-y-auto px-3 py-4">
                  <ul className="space-y-1">
                    {mainNav.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
                              isActive ? 'bg-brand/5 text-brand' : 'text-ink hover:bg-surface',
                            )
                          }
                        >
                          {item.label}
                          <ArrowRight className="size-4 opacity-40" aria-hidden />
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="space-y-3 border-t border-line p-5">
                  {dealer.hotline && (
                    <a
                      href={telHref(dealer.hotline)}
                      className="flex h-12 items-center justify-center gap-2 rounded-full border border-line font-semibold text-brand"
                    >
                      <Phone className="size-4" aria-hidden /> {dealer.hotline}
                    </a>
                  )}
                  <QuoteLink className="w-full" onNavigate={() => setOpen(false)}>
                    Nhận tư vấn
                  </QuoteLink>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}
