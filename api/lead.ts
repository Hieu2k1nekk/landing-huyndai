/**
 * API NHẬN LEAD -> GỬI TỚI ZALO BOT (Vercel Function: POST /api/lead)
 * ---------------------------------------------------------------------------
 * Biến môi trường (CHỈ đặt ở server – KHÔNG dùng tiền tố VITE_ để token không lộ ra trình duyệt):
 *   ZALO_BOT_TOKEN  token của Zalo Bot, dạng "<botId>:<secret>"
 *   ZALO_CHAT_IDS   danh sách chat_id nhận tin, cách nhau bằng dấu phẩy
 *                   (lấy bằng: node scripts/zalo-get-chat-id.mjs sau khi nhắn tin cho bot)
 * Tài liệu: https://bot.zaloplatforms.com/docs/apis/sendMessage/
 */
const ZALO_API = 'https://bot-api.zaloplatforms.com'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const vnd = (n: number | null) => (n == null ? '—' : `${Math.round(n).toLocaleString('vi-VN')}đ`)

const VERSION_LABEL: Record<string, string> = { 'tra-thang': 'Trả thẳng', 'tra-gop': 'Trả góp' }

function buildMessage(d: Record<string, unknown>) {
  const lines = [
    '🚗 YÊU CẦU BÁO GIÁ MỚI',
    '',
    `👤 Họ tên: ${str(d.fullName, 100)}`,
    `📞 SĐT: ${str(d.phone, 20)}`,
    '',
    `🚘 Xe: ${str(d.vehicle, 80) || '—'}`,
    `⚙️ Phiên bản: ${str(d.version, 80) || 'Tất cả phiên bản'}`,
    `🎨 Màu: ${str(d.color, 40) || '—'}`,
    `💳 Thanh toán: ${VERSION_LABEL[str(d.paymentMethod, 20)] ?? '—'}`,
  ]
  const f = d.financing as Record<string, unknown> | undefined
  if (f && typeof f === 'object') {
    lines.push(
      '',
      '📊 Ước tính trả góp (khách tự tính trên web):',
      `• Giá xe: ${vnd(num(f.carPrice))}`,
      `• Trả trước ${num(f.downPaymentPercent) ?? '—'}%: ${vnd(num(f.downPayment))}`,
      `• Vay: ${vnd(num(f.loanAmount))} / ${num(f.termMonths) ?? '—'} tháng`,
      `• Lãi suất giả định: ${num(f.annualRatePercent) ?? '—'}%/năm`,
      `• Trả mỗi tháng ~ ${vnd(num(f.monthlyPayment))}`,
    )
  }
  const note = str(d.note, 500)
  if (note) lines.push('', `📝 Ghi chú: ${note}`)
  lines.push('', `🔗 Nguồn: ${str(d.source, 200) || '—'}`, `🕒 ${str(d.submittedAt, 40) || new Date().toISOString()}`)
  return lines.join('\n').slice(0, 2000)
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.ZALO_BOT_TOKEN
  const chatIds = (process.env.ZALO_CHAT_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (!token || chatIds.length === 0) return json({ ok: false, error: 'not-configured' }, 503)

  let data: Record<string, unknown>
  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid-json' }, 400)
  }

  const phone = str(data.phone, 20).replace(/[\s.\-()]/g, '')
  if (str(data.fullName, 100).length < 2 || !/^(0|\+?84)\d{9,10}$/.test(phone)) {
    return json({ ok: false, error: 'invalid-input' }, 400)
  }

  const text = buildMessage({ ...data, phone })
  const results = await Promise.allSettled(
    chatIds.map(async (chat_id) => {
      const res = await fetch(`${ZALO_API}/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text }),
      })
      const body = (await res.json().catch(() => null)) as { ok?: boolean } | null
      if (!res.ok || !body?.ok) throw new Error(`zalo ${res.status}`)
    }),
  )

  // Chỉ coi là thành công khi ít nhất một người nhận được tin
  if (!results.some((r) => r.status === 'fulfilled')) return json({ ok: false, error: 'delivery-failed' }, 502)
  return json({ ok: true })
}
