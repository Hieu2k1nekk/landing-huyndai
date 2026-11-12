/**
 * Ước tính trả góp đều hàng tháng theo dư nợ giảm dần (annuity):
 *   Trả trước  = Giá xe × tỷ lệ trả trước
 *   Số tiền vay P = Giá xe − Trả trước
 *   r = lãi suất năm / 12,  n = số tháng
 *   Khoản trả mỗi tháng = P × r / (1 − (1 + r)^−n)
 * Chỉ là số liệu ước tính – không phải cam kết khoản vay của ngân hàng.
 */
export const INSTALLMENT_LIMITS = {
  downPayment: { min: 10, max: 80, step: 5, default: 20 },
  rate: { min: 5, max: 15, step: 0.5, default: 9 },
  terms: [12, 24, 36, 48, 60, 72, 84, 96] as const,
  defaultTerm: 60,
  price: { min: 100_000_000, max: 20_000_000_000 },
}

export interface InstallmentInput {
  carPrice: number
  downPaymentPercent: number
  termMonths: number
  annualRatePercent: number
}

export interface InstallmentResult extends InstallmentInput {
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  totalInterest: number
}

/** Khoản trả đều mỗi tháng (đồng) */
export function annuityPayment(principal: number, annualRatePercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRatePercent / 100 / 12
  if (r === 0) return principal / months
  return (principal * r) / (1 - Math.pow(1 + r, -months))
}

export function calculateInstallment(input: InstallmentInput): InstallmentResult {
  const carPrice = Math.max(0, Math.round(input.carPrice) || 0)
  const downPayment = Math.round((carPrice * input.downPaymentPercent) / 100)
  const loanAmount = carPrice - downPayment
  const monthly = annuityPayment(loanAmount, input.annualRatePercent, input.termMonths)
  const monthlyPayment = Math.round(monthly)
  return {
    ...input,
    carPrice,
    downPayment,
    loanAmount,
    monthlyPayment,
    totalInterest: Math.max(0, Math.round(monthly * input.termMonths - loanAmount)),
  }
}

/** Phương án trả góp gửi kèm yêu cầu tư vấn */
export interface InstallmentPlan extends InstallmentResult {
  vehicle?: string // slug
  version?: string
}

/** 12345678 -> "12.345.678 ₫" */
export const formatVnd = (v: number) => `${Math.round(v).toLocaleString('vi-VN')} ₫`
/** 8.5 -> "8,5" */
export const formatPercent = (v: number) => v.toLocaleString('vi-VN', { maximumFractionDigits: 2 })
/** 60 -> "60 tháng (5 năm)" */
export const formatTerm = (m: number) => `${m} tháng${m % 12 === 0 ? ` (${m / 12} năm)` : ''}`
