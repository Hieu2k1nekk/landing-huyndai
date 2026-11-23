import { useCallback, useEffect, useId, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'
import { borderFor, control } from '@/components/ui/FormControls'

/** Captcha phép tính cộng/trừ/nhân/chia – chạy hoàn toàn trên trình duyệt, không cần khóa dịch vụ ngoài. */
export const CAPTCHA_ENABLED = true

interface Challenge {
  text: string
  answer: number
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

function makeChallenge(): Challenge {
  switch (rand(0, 3)) {
    case 0: {
      const a = rand(2, 15)
      const b = rand(2, 15)
      return { text: `${a} + ${b}`, answer: a + b }
    }
    case 1: {
      const a = rand(8, 20)
      const b = rand(1, a - 1)
      return { text: `${a} − ${b}`, answer: a - b }
    }
    case 2: {
      const a = rand(2, 9)
      const b = rand(2, 9)
      return { text: `${a} × ${b}`, answer: a * b }
    }
    default: {
      const b = rand(2, 9)
      const q = rand(2, 9)
      return { text: `${b * q} ÷ ${b}`, answer: q }
    }
  }
}

/**
 * Gọi onToken('ok') khi nhập đúng kết quả, onToken('') khi sai/để trống.
 * Đề được tạo sau khi hydrate (tránh lệch HTML prerender).
 */
export function Captcha({ onToken, invalid }: { onToken: (token: string) => void; invalid?: boolean }) {
  const inputId = useId()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [value, setValue] = useState('')

  const refresh = useCallback(() => {
    setChallenge(makeChallenge())
    setValue('')
    onToken('')
  }, [onToken])

  useEffect(() => {
    setChallenge(makeChallenge())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const change = (v: string) => {
    setValue(v)
    onToken(challenge && v.trim() !== '' && Number(v.trim()) === challenge.answer ? 'ok' : '')
  }

  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-ink">
        Xác minh bạn không phải người máy
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      </label>
      <div className="flex items-center gap-3">
        <span
          aria-live="polite"
          className="inline-flex h-13 min-w-32 select-none items-center justify-center rounded-[var(--radius-control)] bg-surface px-4 text-lg font-bold tracking-wide text-brand tabular-nums"
        >
          {challenge ? `${challenge.text} = ?` : '…'}
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Kết quả"
          aria-required
          aria-invalid={invalid}
          value={value}
          onChange={(e) => change(e.target.value)}
          className={cn(control, borderFor(!!invalid), 'max-w-40')}
        />
        <button
          type="button"
          onClick={refresh}
          aria-label="Đổi phép tính khác"
          className="grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-brand"
        >
          <RefreshCw className="size-4.5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
