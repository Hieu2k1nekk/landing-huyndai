/**
 * SERVICE LAYER – GỬI THÔNG TIN KHÁCH HÀNG (LEAD)
 * ---------------------------------------------------------------------------
 * Cấu hình endpoint qua biến môi trường VITE_LEAD_API_URL (POST JSON).
 * Có thể thay phần `transport` để tích hợp CRM, Google Sheets, Laravel API…
 *
 * ⚠ Khi chưa cấu hình endpoint, service ném LeadServiceNotConfiguredError –
 *   UI sẽ thông báo rõ cho khách, KHÔNG giả lập rằng đã gửi thành công.
 *   Riêng môi trường dev có thể bật VITE_LEAD_MOCK=true để kiểm thử giao diện.
 */
export interface LeadPayload {
  fullName: string
  phone: string
  vehicle: string
  version?: string
  province: string
  paymentMethod: 'tra-thang' | 'tra-gop'
  note?: string
  source: string // trang gửi form
  submittedAt: string
}

export class LeadServiceNotConfiguredError extends Error {
  constructor() {
    super('Lead endpoint chưa được cấu hình (VITE_LEAD_API_URL).')
    this.name = 'LeadServiceNotConfiguredError'
  }
}

export class LeadSubmitError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'LeadSubmitError'
  }
}

const endpoint = import.meta.env.VITE_LEAD_API_URL as string | undefined
const devMock = import.meta.env.DEV && import.meta.env.VITE_LEAD_MOCK === 'true'

export const isLeadServiceConfigured = Boolean(endpoint) || devMock

export async function submitLead(payload: LeadPayload, signal?: AbortSignal): Promise<void> {
  if (devMock && !endpoint) {
    console.info('[leadService] DEV MOCK – dữ liệu KHÔNG được gửi đi:', payload)
    await new Promise((r) => setTimeout(r, 900))
    return
  }
  if (!endpoint) throw new LeadServiceNotConfiguredError()

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })
  if (!res.ok) throw new LeadSubmitError(`Gửi thông tin thất bại (HTTP ${res.status})`, res.status)
}
