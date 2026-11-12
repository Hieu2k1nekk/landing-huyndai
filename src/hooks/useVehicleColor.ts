import { useCallback, useSyncExternalStore } from 'react'
import type { VehicleColor } from '@/types'
import { findColor, getColorConfig, getDefaultColor } from '@/data/vehicles/colors'

/**
 * Trạng thái màu đang chọn theo từng mẫu xe – dùng chung cho card, trang chi tiết, form báo giá.
 * Lưu trong sessionStorage để giữ lựa chọn khi chuyển trang (cùng phiên duyệt web).
 * Khoá theo slug -> chuyển xe không bao giờ "kế thừa" nhầm màu của xe khác.
 */
const KEY = 'hy:vehicle-colors'
type Selection = Record<string, string>

let state: Selection = {}
let hydrated = false
const listeners = new Set<() => void>()

function load() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) state = JSON.parse(raw) as Selection
  } catch {
    /* storage bị chặn -> chỉ giữ trong bộ nhớ */
  }
}

export function setVehicleColor(slug: string, colorId: string) {
  load()
  if (!findColor(slug, colorId) || state[slug] === colorId) return
  state = { ...state, [slug]: colorId }
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* bỏ qua */
  }
  listeners.forEach((l) => l())
}

/** Màu khách đã chủ động chọn (không tính màu mặc định) */
export function getChosenColor(slug: string): VehicleColor | undefined {
  load()
  return findColor(slug, state[slug])
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getSnapshot = () => {
  load()
  return state
}
const EMPTY: Selection = {}
const getServerSnapshot = () => EMPTY

export function useVehicleColor(slug: string) {
  const selection = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const config = getColorConfig(slug)
  const chosen = findColor(slug, selection[slug])
  const color = chosen ?? getDefaultColor(slug)
  const setColor = useCallback((id: string) => setVehicleColor(slug, id), [slug])
  return { config, colors: config.colors, color, chosen, setColor }
}
