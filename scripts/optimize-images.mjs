/**
 * Tối ưu ảnh nguồn -> public/images (WebP) + sinh manifest kích thước.
 *
 * - Ảnh xe:   src/assets/images/cars/<slug>/source.png  (PNG nền trong suốt)
 *             -> public/images/cars/<slug>/<slug>-<w>.webp (giữ kênh alpha)
 * - Ảnh tin:  src/assets/images/news/*.jpg
 *             -> public/images/news/<name>-<w>.webp (crop 3:2)
 * - OG image: public/og-default.jpg (1200x630)
 *
 * Chạy: npm run images
 */
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'src/assets/images')
const OUT = path.join(ROOT, 'public/images')
const MANIFEST = path.join(ROOT, 'src/data/generated/image-manifest.json')

const CAR_WIDTHS = [480, 960]
const NEWS_WIDTHS = [640, 960, 1280]

const manifest = { cars: {}, news: {} }

async function processCars() {
  const dir = path.join(SRC, 'cars')
  for (const slug of await readdir(dir)) {
    const file = path.join(dir, slug, 'source.png')
    if (!existsSync(file)) continue

    // Cắt bỏ phần viền trong suốt để các xe có tỉ lệ hiển thị đồng đều
    const trimmed = await sharp(file).trim({ threshold: 1 }).png().toBuffer()
    const meta = await sharp(trimmed).metadata()
    if (!meta.hasAlpha) console.warn(`⚠ ${slug}: ảnh KHÔNG có kênh alpha`)

    await mkdir(path.join(OUT, 'cars', slug), { recursive: true })
    const variants = []
    const widths = [...new Set(CAR_WIDTHS.map((w) => Math.min(w, meta.width)))]
    for (const w of widths) {
      const name = `${slug}-${w}.webp`
      const info = await sharp(trimmed)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 84, alphaQuality: 90, effort: 6 })
        .toFile(path.join(OUT, 'cars', slug, name))
      variants.push({ src: `/images/cars/${slug}/${name}`, width: info.width, height: info.height })
    }
    manifest.cars[slug] = {
      width: meta.width,
      height: meta.height,
      variants,
    }
    console.log(`✓ car ${slug} ${meta.width}x${meta.height} -> ${widths.join(', ')}`)
  }
}

/**
 * Ảnh theo từng màu ngoại thất: src/assets/images/cars/<slug>/colors/<colorId>.png
 *   -> public/images/cars/<slug>/colors/<colorId>-<w>.webp
 * (nguồn tải bằng scripts/fetch-vehicle-colors.mjs – mỗi màu một ảnh thật, cùng góc chụp)
 */
const COLOR_WIDTHS = [480, 960, 1280]

/** Cắt theo khung chứa pixel có alpha thật (bỏ các pixel gần như trong suốt ở viền ảnh) */
async function trimAlpha(file, min = 12) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] >= min) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
  return sharp(file).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer()
}

async function processCarColors() {
  manifest.carColors = {}
  const dir = path.join(SRC, 'cars')
  for (const slug of await readdir(dir)) {
    const colorDir = path.join(dir, slug, 'colors')
    if (!existsSync(colorDir)) continue
    const outDir = path.join(OUT, 'cars', slug, 'colors')
    await mkdir(outDir, { recursive: true })
    manifest.carColors[slug] = {}
    for (const file of (await readdir(colorDir)).filter((f) => f.endsWith('.png')).sort()) {
      const id = file.replace(/\.png$/, '')
      const trimmed = await trimAlpha(path.join(colorDir, file))
      const meta = await sharp(trimmed).metadata()
      const variants = []
      for (const w of [...new Set(COLOR_WIDTHS.map((w) => Math.min(w, meta.width)))]) {
        const name = `${id}-${w}.webp`
        const info = await sharp(trimmed)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 82, alphaQuality: 90, effort: 6 })
          .toFile(path.join(outDir, name))
        variants.push({ src: `/images/cars/${slug}/colors/${name}`, width: info.width, height: info.height })
      }
      manifest.carColors[slug][id] = { width: meta.width, height: meta.height, variants }
    }
    console.log(`✓ colors ${slug}: ${Object.keys(manifest.carColors[slug]).join(', ')}`)
  }
}

async function processNews() {
  const dir = path.join(SRC, 'news')
  await mkdir(path.join(OUT, 'news'), { recursive: true })
  for (const file of await readdir(dir)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue
    const name = file.replace(/\.[^.]+$/, '')
    const variants = []
    for (const w of NEWS_WIDTHS) {
      const h = Math.round((w * 2) / 3)
      const out = `${name}-${w}.webp`
      await sharp(path.join(dir, file))
        .resize(w, h, { fit: 'cover', position: 'attention' })
        .webp({ quality: 78, effort: 6 })
        .toFile(path.join(OUT, 'news', out))
      variants.push({ src: `/images/news/${out}`, width: w, height: h })
    }
    manifest.news[name] = { width: NEWS_WIDTHS.at(-1), height: Math.round((NEWS_WIDTHS.at(-1) * 2) / 3), variants }
    console.log(`✓ news ${name}`)
  }
}

/**
 * Ảnh hero (art direction):
 *  - landscape: giữ tỉ lệ gốc, dùng cho tablet/desktop (object-fit: cover + object-position)
 *  - square:    crop vuông quanh xe (focusX = tâm xe theo chiều ngang, 0..1) cho mobile
 */
const HERO = [
  { name: 'tucson-hev-run1', focusX: 0.47 },
  { name: 'palisade-0056', focusX: 0.49 },
]
const HERO_LANDSCAPE = [960, 1440, 1920]
const HERO_SQUARE = [640, 1080]

async function processHero() {
  manifest.hero = {}
  await mkdir(path.join(OUT, 'hero'), { recursive: true })
  for (const { name, focusX } of HERO) {
    const file = path.join(SRC, 'news', `${name}.jpg`)
    const meta = await sharp(file).metadata()
    const landscape = []
    for (const w of HERO_LANDSCAPE.filter((w) => w <= meta.width)) {
      const out = `${name}-${w}.webp`
      const info = await sharp(file).resize({ width: w }).webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, 'hero', out))
      landscape.push({ src: `/images/hero/${out}`, width: info.width, height: info.height })
    }
    const side = meta.height
    const left = Math.max(0, Math.min(meta.width - side, Math.round(focusX * meta.width - side / 2)))
    const square = []
    for (const w of HERO_SQUARE.filter((w) => w <= side)) {
      const out = `${name}-sq-${w}.webp`
      await sharp(file)
        .extract({ left, top: 0, width: side, height: side })
        .resize(w, w)
        .webp({ quality: 74, effort: 6 })
        .toFile(path.join(OUT, 'hero', out))
      square.push({ src: `/images/hero/${out}`, width: w, height: w })
    }
    manifest.hero[name] = { landscape, square }
    console.log(`✓ hero ${name}`)
  }
}

async function processOg() {
  await sharp(path.join(SRC, 'news/tucson-hev-1.jpg'))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ROOT, 'public/og-default.jpg'))
  console.log('✓ og-default.jpg')
}

await processCars()
await processCarColors()
await processNews()
await processHero()
await processOg()
await mkdir(path.dirname(MANIFEST), { recursive: true })
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`✓ manifest -> ${path.relative(ROOT, MANIFEST)}`)
