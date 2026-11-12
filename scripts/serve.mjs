/**
 * Static server để xem thử bản build (mô phỏng hosting thật):
 *  - /san-pham        -> dist/client/san-pham/index.html
 *  - URL không tồn tại -> dist/client/404.html (HTTP 404)
 *  - /assets/*        -> cache dài hạn (file có hash)
 *  - Nén brotli/gzip cho file văn bản (giống CDN/hosting thật)
 * Dùng: npm run preview  (PORT=4173 mặc định)
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const root = path.resolve(import.meta.dirname, '../dist/client')
const port = Number(process.env.PORT) || 4173

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
}

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.xml', '.txt', '.svg'])

function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '')
  const abs = path.join(root, clean)
  if (!abs.startsWith(root)) return null
  for (const candidate of [abs, path.join(abs, 'index.html'), `${abs}.html`]) {
    try {
      if (fs.statSync(candidate).isFile()) return candidate
    } catch {}
  }
  return null
}

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://x')
    let file = resolveFile(pathname)
    let status = 200
    if (!file) {
      file = path.join(root, '404.html')
      status = 404
    }
    const ext = path.extname(file)
    const accept = String(req.headers['accept-encoding'] || '')
    const encoding = COMPRESSIBLE.has(ext) ? (/\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null) : null
    res.writeHead(status, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      Vary: 'Accept-Encoding',
      ...(encoding && { 'Content-Encoding': encoding }),
    })
    const stream = fs.createReadStream(file)
    if (encoding === 'br') stream.pipe(zlib.createBrotliCompress()).pipe(res)
    else if (encoding === 'gzip') stream.pipe(zlib.createGzip()).pipe(res)
    else stream.pipe(res)
  })
  .listen(port, () => console.log(`Preview: http://localhost:${port}`))
