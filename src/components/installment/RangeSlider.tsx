import type { CSSProperties, ReactNode } from 'react'

/**
 * Thanh trượt dùng input[type=range] gốc (không cần thư viện): hỗ trợ sẵn bàn phím, cảm ứng, trình đọc màn hình.
 * Giao diện tuỳ biến bằng class `.range` (globals.css); phần đã chọn tô theo biến --fill.
 */
export function RangeSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  valueText,
  minLabel,
  maxLabel,
  children,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  /** Giá trị hiển thị lớn (vd "20%") */
  display: ReactNode
  /** Đọc cho trình đọc màn hình (vd "20 phần trăm") */
  valueText: string
  minLabel: string
  maxLabel: string
  children?: ReactNode
}) {
  const fill = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <output htmlFor={id} className="text-[1.75rem] leading-none font-bold tracking-tight text-brand tabular-nums">
          {display}
        </output>
      </div>
      {children}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-2"
        style={{ '--fill': `${fill}%` } as CSSProperties}
      />
      <div className="flex justify-between text-xs text-muted tabular-nums" aria-hidden>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
