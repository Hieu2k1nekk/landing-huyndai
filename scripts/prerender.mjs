/**
 * Prerender (SSG): render mọi route thành HTML tĩnh để crawler đọc được nội dung,
 * sinh sitemap.xml, robots.txt và 404.html.
 * Chạy sau `vite build` (client) và `vite build --ssr` (server).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const clientDir = path.join(root, 'dist/client')
const serverEntry = path.join(root, 'dist/server/entry-server.js')

const template = await fs.readFile(path.join(clientDir, 'index.html'), 'utf8')
if (!template.includes('<!--app-html-->')) {
  console.error('✗ dist/client/index.html đã được prerender trước đó. Hãy chạy lại `npm run build`.')
  process.exit(1)
}
const { render, prerenderPaths, siteConfig } = await import(pathToFileURL(serverEntry).href)

const fill = ({ html, head }) => {
  // React chèn <link rel="preload"> (ảnh LCP) ở đầu output – đưa lên <head> để trình duyệt phát hiện sớm
  const hints = html.match(/^(?:<link [^>]*\/?>)+/)?.[0] ?? ''
  return template
    .replace('<!--app-head-->', () => `${hints}\n    ${head}`)
    .replace('<!--app-html-->', () => html.slice(hints.length))
}

const today = new Date().toISOString().slice(0, 10)
let count = 0

for (const route of prerenderPaths) {
  const out = route.path === '/' ? path.join(clientDir, 'index.html') : path.join(clientDir, route.path, 'index.html')
  await fs.mkdir(path.dirname(out), { recursive: true })
  await fs.writeFile(out, fill(await render(route.path)))
  count++
}

// 404
await fs.writeFile(path.join(clientDir, '404.html'), fill(await render('/__khong-ton-tai__')))

// sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${prerenderPaths
  .map(
    (r) => `  <url>
    <loc>${siteConfig.siteUrl}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${r.lastmod ?? today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
await fs.writeFile(path.join(clientDir, 'sitemap.xml'), sitemap)

// robots.txt
await fs.writeFile(
  path.join(clientDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${siteConfig.siteUrl}/sitemap.xml\n`,
)

console.log(`✓ Prerendered ${count} routes + 404.html, sitemap.xml, robots.txt`)
if (siteConfig.siteUrl.includes('.example'))
  console.warn('⚠ VITE_SITE_URL chưa được cấu hình – canonical/sitemap đang dùng domain mẫu.')
