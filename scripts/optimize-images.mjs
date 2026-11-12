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

async function processOg() {
  await sharp(path.join(SRC, 'news/tucson-hev-1.jpg'))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(ROOT, 'public/og-default.jpg'))
  console.log('✓ og-default.jpg')
}

await processCars()
await processNews()
await processOg()
await mkdir(path.dirname(MANIFEST), { recursive: true })
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`✓ manifest -> ${path.relative(ROOT, MANIFEST)}`)
