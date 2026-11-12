import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'light' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-offset-2'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-700 shadow-[0_6px_18px_-6px_rgb(0_44_95/0.5)]',
  accent: 'bg-accent text-white hover:bg-accent-600 shadow-[0_6px_18px_-6px_rgb(0_114_206/0.55)]',
  outline: 'border border-line bg-white text-ink hover:border-brand hover:text-brand',
  ghost: 'text-brand hover:bg-brand/5',
  light: 'bg-white text-brand hover:bg-surface',
  'outline-light': 'border border-white/30 text-white hover:bg-white/10 hover:border-white/60',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[0.9375rem]',
  lg: 'h-14 px-7 text-base',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className)

interface CommonProps {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & CommonProps>(
  ({ variant, size, className, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />
  ),
)
Button.displayName = 'Button'

export function ButtonLink({ variant, size, className, ...props }: LinkProps & CommonProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />
}

export function ButtonAnchor({
  variant,
  size,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps) {
  return <a className={buttonClass(variant, size, className)} {...props} />
}
