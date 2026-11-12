/**
 * Sinh favicon / icon PWA / logo từ SVG (biểu tượng cách điệu, không phải logo chính thức).
 * Khi có logo chính thức của đại lý, thay public/favicon.svg & public/logo.png.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const pub = path.resolve(import.meta.dirname, '../public')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#002C5F"/>
  <ellipse cx="32" cy="32" rx="22" ry="14.5" fill="none" stroke="#fff" stroke-width="3.2"/>
  <path d="M24.5 22.5 L22 41.5 M42 22.5 L39.5 41.5 M23.3 32.4 C29 30.2 35 33.6 40.7 31.4" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>
</svg>`

await fs.writeFile(path.join(pub, 'favicon.svg'), svg)
const buf = Buffer.from(svg)
await sharp(buf, { density: 300 }).resize(32, 32).png().toFile(path.join(pub, 'favicon-32.png'))
await sharp(buf, { density: 600 }).resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'))
await sharp(buf, { density: 600 }).resize(192, 192).png().toFile(path.join(pub, 'icon-192.png'))
await sharp(buf, { density: 900 }).resize(512, 512).png().toFile(path.join(pub, 'icon-512.png'))
await sharp(buf, { density: 900 }).resize(512, 512).png().toFile(path.join(pub, 'logo.png'))

await fs.writeFile(
  path.join(pub, 'site.webmanifest'),
  JSON.stringify(
    {
      name: process.env.VITE_SITE_NAME || 'Hyundai Showroom',
      short_name: 'Hyundai',
      lang: 'vi',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#002C5F',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ),
)
console.log('✓ Icons generated')
