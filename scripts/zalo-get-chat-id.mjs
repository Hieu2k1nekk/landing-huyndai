/**
 * Lấy chat_id để nhận lead. Chạy script rồi nhờ từng người nhận nhắn tin bất kỳ cho Zalo Bot
 * (dùng Zalo ở thiết bị/trình duyệt nào cũng được):
 *   node scripts/zalo-get-chat-id.mjs
 * Script chạy liên tục, mỗi lần có người nhắn sẽ in chat_id. Bấm Ctrl+C để dừng.
 * Token lấy từ biến môi trường ZALO_BOT_TOKEN hoặc .env.local.
 * Lưu ý: getUpdates không hoạt động nếu bot đã đặt Webhook.
 */
import { readFileSync, existsSync } from 'node:fs'

let token = process.env.ZALO_BOT_TOKEN
if (!token && existsSync('.env.local')) {
  token = readFileSync('.env.local', 'utf8').match(/^ZALO_BOT_TOKEN=(.+)$/m)?.[1]?.trim()
}
if (!token) {
  console.error('Thiếu ZALO_BOT_TOKEN')
  process.exit(1)
}

console.log('Đang chờ tin nhắn tới bot... (Ctrl+C để dừng)')
const seen = new Set()
for (;;) {
  try {
    const res = await fetch(`https://bot-api.zaloplatforms.com/bot${token}/getUpdates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeout: '30' }),
    })
    const body = await res.json()
    const m = body.ok ? body.result?.message : null
    if (m?.chat?.id) {
      const line = `chat_id: ${m.chat.id}  (${m.from?.display_name ?? '?'}, ${m.chat.chat_type})`
      if (!seen.has(m.chat.id)) console.log(line)
      seen.add(m.chat.id)
      console.log('ZALO_CHAT_IDS=' + [...seen].join(','))
    } else if (!body.ok && body.error_code !== 408) {
      console.error('Lỗi:', body.description ?? body)
      await new Promise((r) => setTimeout(r, 3000))
    }
  } catch (e) {
    console.error('Lỗi mạng:', e.message)
    await new Promise((r) => setTimeout(r, 3000))
  }
}
