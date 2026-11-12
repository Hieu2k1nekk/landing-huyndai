/**
 * Đồng bộ MÀU NGOẠI THẤT + ẢNH TỪNG MÀU từ dữ liệu chính thức của Hyundai Thành Công
 * (API của hyundai.thanhcong.vn – chính là bộ ảnh 360° trong mục "Ngoại thất" trên website hãng).
 *
 *  - Mỗi màu: lấy đúng 1 khung hình 360° ở cùng góc 3/4 phía trước cho mọi màu của một mẫu xe
 *    (khung hình được kiểm tra bằng so khớp silhouette, màu nào lệch góc sẽ tự tìm khung khớp nhất).
 *  - Ảnh PNG nền trong suốt -> src/assets/images/cars/<slug>/colors/<id>.png
 *    (sau đó `npm run images` sinh WebP nhiều kích thước).
 *  - Mã màu swatch lấy từ ẢNH SWATCH CHÍNH THỨC của từng màu (không tự đoán).
 *  - Sinh file cấu hình src/data/vehicles/<slug>/colors.ts (có thể chỉnh tay sau đó).
 *
 * KHÔNG dùng CSS filter/hue-rotate, KHÔNG dùng chung ảnh cho nhiều màu.
 * Mẫu xe chưa có dữ liệu màu chính xác -> status 'pending' (UI hiển thị "đang cập nhật").
 *
 * Chạy: node scripts/fetch-vehicle-colors.mjs [slug...]   (cần curl – API dùng TLS cũ)
 */
import { execFileSync } from 'node:child_process'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const API = 'https://hyundai-api.thanhcong.vn/api/front/product'
const OFFICIAL = 'https://hyundai.thanhcong.vn'

/**
 * offset = vị trí khung hình (tính từ khung đầu tiên) cho góc 3/4 phía trước, đầu xe quay sang trái.
 * pending = chưa có ảnh màu chính xác cho đúng thế hệ xe đang bán -> không hiển thị ảnh màu.
 */
const MODELS = {
  'grand-i10': { api: 'new-grand-i10', pending: 'Website chính thức chưa công bố bộ ảnh theo từng màu.' },
  accent: { api: 'all-new-accent', offset: 32 },
  elantra: { api: 'elantra', offset: 5 },
  venue: { api: 'san-pham/venue', offset: 4 },
  creta: { api: 'san-pham/new-creta', offset: 30 },
  tucson: { api: 'san-pham/tucson', offset: 5 },
  'santa-fe': { api: 'san-pham/santa-fe', offset: 6 },
  stargazer: { api: 'stargazer', offset: 32 },
  custin: { api: 'custin', pending: 'Website chính thức chưa công bố bộ ảnh theo từng màu.' },
  palisade: {
    api: 'palisade',
    pending: 'Bộ ảnh màu trên website chính thức là thế hệ trước – chờ ảnh màu của Palisade thế hệ mới.',
  },
}

const curl = (url, out) =>
  execFileSync('curl', ['-sfL', '-m', '90', '-A', 'Mozilla/5.0', ...(out ? ['-o', out] : []), url], { maxBuffer: 1e8 })

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Ghép tên màu chuẩn hoá chữ hoa đầu câu: "Xanh Lục Bảo" -> "Xanh lục bảo" */
const tidyName = (s) => {
  const t = s.trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi')
  return t.charAt(0).toLocaleUpperCase('vi') + t.slice(1)
}

function exteriorColors(json) {
  const items = []
  const walk = (o) => {
    if (Array.isArray(o)) o.forEach(walk)
    else if (o && typeof o === 'object') {
      if (o.type === 'exterior' && o.color && o.images?.file_url) items.push(o)
      else Object.values(o).forEach(walk)
    }
  }
  walk(json)
  const seen = new Set()
  return items
    .filter((i) => i.status === 1 && !seen.has(i.color.id) && seen.add(i.color.id))
    .sort((a, b) => a.priority - b.priority)
    .map((i) => {
      const { file_url, file_name, total_img, first_img } = i.images
      const tpl = file_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\{index\\}', '(\\d+)')
      const m = decodeURIComponent(first_img).match(new RegExp(tpl + '$'))
      return {
        name: tidyName(i.color.title),
        swatch: i.color.thumbnail,
        total: total_img,
        start: m ? Number(m[1]) : 0,
        frame: (n) => encodeURI(`${file_url}/${file_name.replace('{index}', n)}`),
      }
    })
}

const MW = 96
const MH = 48
async function silhouette(buf) {
  const t = await sharp(buf).trim({ threshold: 1 }).toBuffer()
  return sharp(t).resize(MW, MH, { fit: 'fill' }).ensureAlpha().extractChannel(3).raw().toBuffer()
}
const iou = (a, b) => {
  let i = 0
  let u = 0
  for (let k = 0; k < a.length; k++) {
    const x = a[k] > 128
    const y = b[k] > 128
    if (x && y) i++
    if (x || y) u++
  }
  return i / u
}

/** Mã màu trung bình vùng giữa ảnh swatch chính thức */
async function swatchHex(url) {
  const buf = curl(encodeURI(url))
  const img = sharp(buf).flatten({ background: '#ffffff' })
  const { width, height } = await img.metadata()
  const w = Math.max(1, Math.round(width * 0.4))
  const h = Math.max(1, Math.round(height * 0.4))
  const { channels } = await sharp(buf)
    .flatten({ background: '#ffffff' })
    .extract({ left: Math.round((width - w) / 2), top: Math.round((height - h) / 2), width: w, height: h })
    .stats()
  return '#' + channels.slice(0, 3).map((c) => Math.round(c.mean).toString(16).padStart(2, '0')).join('')
}

/** Màu trung bình của thân xe (pixel có alpha) – dùng để chọn màu mặc định giống ảnh đang dùng */
async function bodyRgb(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().resize(160).raw().toBuffer({ resolveWithObject: true })
  let r = 0, g = 0, b = 0, n = 0
  for (let k = 0; k < data.length; k += info.channels) {
    if (data[k + 3] < 200) continue
    r += data[k]; g += data[k + 1]; b += data[k + 2]; n++
  }
  return [r / n, g / n, b / n]
}

function writeConfig(slug, conf) {
  const lines = [
    `/**`,
    ` * Màu ngoại thất ${slug} – sinh bởi scripts/fetch-vehicle-colors.mjs, có thể chỉnh tay.`,
    ` * Nguồn: ${OFFICIAL} (mục Ngoại thất – ảnh 360° theo từng màu).`,
    ` * \`versions\`: điền khi có dữ liệu màu theo phiên bản; bỏ trống = chưa có dữ liệu phân theo phiên bản.`,
    ` */`,
    `import type { VehicleColorConfig } from '@/types'`,
    ``,
    `export const colors: VehicleColorConfig = ${JSON.stringify(conf, null, 2).replace(/"([a-zA-Z]+)":/g, '$1:').replace(/"/g, "'")}`,
    ``,
  ]
  return writeFile(path.join(ROOT, 'src/data/vehicles', slug, 'colors.ts'), lines.join('\n'))
}

const only = process.argv.slice(2)
for (const [slug, m] of Object.entries(MODELS)) {
  if (only.length && !only.includes(slug)) continue
  await mkdir(path.join(ROOT, 'src/data/vehicles', slug), { recursive: true })

  if (m.pending) {
    await writeConfig(slug, { status: 'pending', note: m.pending, sourceUrl: `${OFFICIAL}/${m.api}`, colors: [] })
    console.log(`… ${slug}: pending`)
    continue
  }

  const list = exteriorColors(JSON.parse(curl(`${API}/${m.api}?view=all`).toString()))
  const outDir = path.join(ROOT, 'src/assets/images/cars', slug, 'colors')
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const ref = list[0]
  const refFrame = curl(ref.frame(ref.start + m.offset))
  const refMask = await silhouette(refFrame)
  const sourcePng = path.join(ROOT, 'src/assets/images/cars', slug, 'source.png')
  const sourceRgb = existsSync(sourcePng) ? await bodyRgb(sourcePng) : null

  const colors = []
  let best = { d: Infinity, id: '' }
  for (const c of list) {
    const id = slugify(c.name)
    let buf
    let score = 0
    // Chỉ số khung đầu tiên giữa các màu có thể lệch nhau -> thử các khung lân cận, lấy khung khớp nhất
    for (let d = -3; d <= 3; d++) {
      try {
        const b = curl(c.frame(c.start + m.offset + d))
        const s = iou(refMask, await silhouette(b))
        if (s > score) [buf, score] = [b, s]
      } catch {}
    }
    if (!buf || score < 0.95) {
      // Bộ ảnh của màu này đánh số khác -> tìm khung hình khớp góc nhất
      for (let k = 0; k < c.total; k++) {
        try {
          const b = curl(c.frame(c.start + k))
          const s = iou(refMask, await silhouette(b))
          if (s > score) [buf, score] = [b, s]
        } catch {}
      }
    }
    if (!buf || score < 0.92) {
      console.warn(`⚠ ${slug}/${id}: không tìm được khung hình cùng góc (IoU ${score.toFixed(2)}) -> chưa có ảnh`)
      colors.push({ id, name: c.name, hex: await swatchHex(c.swatch), hasImage: false })
      continue
    }
    await sharp(buf).trim({ threshold: 1 }).png({ compressionLevel: 9, effort: 10 }).toFile(path.join(outDir, `${id}.png`))
    const hex = await swatchHex(c.swatch)
    colors.push({ id, name: c.name, hex, hasImage: true })
    if (sourceRgb) {
      const rgb = await bodyRgb(buf)
      const d = rgb.reduce((s, v, i) => s + (v - sourceRgb[i]) ** 2, 0)
      if (d < best.d) best = { d, id }
    }
    console.log(`✓ ${slug}/${id} ${c.name} ${hex} IoU ${score.toFixed(3)}`)
  }
  const conf = {
    status: 'available',
    defaultColor: best.id || colors.find((c) => c.hasImage)?.id,
    sourceUrl: `${OFFICIAL}/${m.api}`,
    colors: colors.map(({ hasImage, ...c }) => (hasImage ? c : { ...c, noImage: true })),
  }
  await writeConfig(slug, conf)
}
console.log('Xong. Chạy `npm run images` để sinh WebP.')
