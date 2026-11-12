import { z } from 'zod'
import { vehicles } from '@/data/vehicles'
import { provinces } from '@/data/provinces'

/** Chuẩn hóa: bỏ khoảng trắng, dấu chấm, gạch; +84 -> 0 */
export const normalizeVnPhone = (raw: string) => raw.replace(/[\s.\-()]/g, '').replace(/^\+?84/, '0')

/**
 * Số di động Việt Nam (10 số): 03x, 05x, 07x, 08x, 09x.
 * Chấp nhận nhập dạng +84 / 84 / có dấu cách, dấu chấm.
 */
export const VN_MOBILE_REGEX = /^0(3[2-9]|5[25689]|7[06-9]|8[1-9]|9\d)\d{7}$/

const vehicleSlugs = vehicles.map((v) => v.slug) as [string, ...string[]]

export const quoteSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)')
    .max(60, 'Họ và tên quá dài')
    .regex(/^[\p{L}\s'.-]+$/u, 'Họ và tên chỉ gồm chữ cái'),
  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .transform(normalizeVnPhone)
    .refine((v) => VN_MOBILE_REGEX.test(v), 'Số điện thoại không hợp lệ (ví dụ: 09xx xxx xxx)'),
  vehicle: z.enum(vehicleSlugs, { error: 'Vui lòng chọn dòng xe quan tâm' }),
  version: z.string().optional(),
  /** Mã màu ngoại thất (id trong src/data/vehicles/<slug>/colors.ts) – tuỳ chọn */
  color: z.string().optional(),
  province: z
    .string()
    .min(1, 'Vui lòng chọn tỉnh/thành phố')
    .refine((v) => (provinces as readonly string[]).includes(v), 'Tỉnh/thành phố không hợp lệ'),
  paymentMethod: z.enum(['tra-thang', 'tra-gop'], { error: 'Vui lòng chọn hình thức thanh toán' }),
  /** Không tích sẵn: sự đồng ý phải là hành động chủ động của người dùng (NĐ 13/2023/NĐ-CP) */
  consent: z.boolean().refine((v) => v, 'Vui lòng đồng ý để chúng tôi liên hệ tư vấn'),
  /** Honeypot chống spam: người dùng thật không thấy trường này */
  website: z.string().max(0).optional(),
})

export type QuoteFormInput = z.input<typeof quoteSchema>
export type QuoteFormValues = z.output<typeof quoteSchema>
