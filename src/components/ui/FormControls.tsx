import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Kiểu ô nhập dùng chung (form báo giá, bảng tính trả góp) */
export const control =
  'flex h-13 w-full items-center rounded-[var(--radius-control)] border bg-white px-4 text-base text-ink outline-none ' +
  'transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 ' +
  'hover:border-ink/25 focus:border-accent focus:ring-4 focus:ring-accent/12 focus-visible:outline-none ' +
  'disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface'

export const borderFor = (invalid: boolean) => (invalid ? 'border-red-400 hover:border-red-400' : 'border-line')

/** Trigger + danh sách tuỳ biến cho Radix Select (thay thẻ select mặc định của trình duyệt) */
export const SelectTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<typeof Select.Trigger> & { invalid?: boolean; placeholder: string }>(
  ({ invalid = false, placeholder, className, ...props }, ref) => (
    <Select.Trigger
      ref={ref}
      className={cn(control, borderFor(invalid), 'justify-between gap-3 text-left data-[placeholder]:text-muted/80', className)}
      {...props}
    >
      <span className="truncate">
        <Select.Value placeholder={placeholder} />
      </span>
      <Select.Icon>
        <ChevronDown className="size-4 shrink-0 text-muted transition-transform duration-200 [[data-state=open]_&]:rotate-180" aria-hidden />
      </Select.Icon>
    </Select.Trigger>
  ),
)
SelectTrigger.displayName = 'SelectTrigger'

export function SelectContent({ items }: { items: { value: string; label: string }[] }) {
  return (
    <Select.Portal>
      <Select.Content
        position="popper"
        sideOffset={6}
        collisionPadding={12}
        className="anim-pop z-50 max-h-[min(var(--radix-select-content-available-height),20rem)] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-line bg-white shadow-[var(--shadow-pop)]"
      >
        <Select.Viewport className="p-1.5">
          {items.map((it) => (
            <Select.Item
              key={it.value}
              value={it.value}
              className="relative flex h-11 cursor-pointer items-center rounded-lg pr-10 pl-3 text-[0.9375rem] text-ink outline-none select-none data-[highlighted]:bg-surface data-[highlighted]:text-brand data-[state=checked]:font-semibold data-[state=checked]:text-brand"
            >
              <Select.ItemText>{it.label}</Select.ItemText>
              <Select.ItemIndicator className="absolute right-3">
                <Check className="size-4" aria-hidden />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  )
}

