import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
  as: H = 'h2',
  id,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  as?: 'h1' | 'h2'
  id?: string
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className={cn('eyebrow mb-4', tone === 'light' && 'text-sky-300', align === 'center' && 'justify-center')}>
          <span className={cn('h-px w-8', tone === 'light' ? 'bg-sky-300' : 'bg-accent')} aria-hidden />
          {eyebrow}
        </p>
      )}
      <H id={id} className={cn('text-h2', tone === 'light' && 'text-white')}>
        {title}
      </H>
      {description && (
        <p className={cn('text-lead mt-5', tone === 'light' ? 'text-white/70' : 'text-muted')}>
          {description}
        </p>
      )}
    </div>
  )
}
