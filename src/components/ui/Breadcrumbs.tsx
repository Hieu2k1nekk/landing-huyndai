import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface Crumb {
  name: string
  path: string
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={c.path} className="inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-medium text-ink">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link to={c.path} className={cn('transition-colors hover:text-brand')}>
                    {c.name}
                  </Link>
                  <ChevronRight className="size-3.5 opacity-60" aria-hidden />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
