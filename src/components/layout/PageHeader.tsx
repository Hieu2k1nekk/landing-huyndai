import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { cn } from '@/utils/cn'

/** Đầu trang con: breadcrumb + H1 duy nhất của trang */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  crumbs: Crumb[]
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('border-b border-line bg-surface', className)}>
      <div className="container-page pt-8 pb-12 lg:pt-10 lg:pb-16">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 max-w-3xl">
          {eyebrow && (
            <p className="eyebrow mb-4">
              <span className="h-px w-6 bg-accent" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1 className="text-[2rem] font-bold sm:text-[2.75rem] lg:text-5xl">{title}</h1>
          {description && <p className="mt-4 text-base text-muted sm:text-lg">{description}</p>}
        </div>
        {children}
      </div>
    </header>
  )
}

export const HOME_CRUMB: Crumb = { name: 'Trang chủ', path: '/' }
