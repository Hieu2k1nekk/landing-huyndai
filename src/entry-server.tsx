import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { App } from './App'
import { HeadCollector, HeadProvider, renderHeadToString } from './seo/head'
import { prerenderPaths } from './routes'
import { siteConfig } from './config/site'

export { prerenderPaths, siteConfig }

/** Boundary bị React "outline": fallback nằm tại chỗ, nội dung thật ở cuối body và được script hoán đổi */
const OUTLINED_BOUNDARY = /<template id="B:\d+"/

/** Render 1 URL thành HTML tĩnh (chờ toàn bộ lazy route/Suspense hoàn tất) */
export async function render(url: string) {
  const collector = new HeadCollector()
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <HeadProvider collector={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>,
    {
      // Mặc định React tách các Suspense boundary lớn (>12.8KB) ra cuối trang và hoán đổi bằng script
      // để stream dần. Với HTML tĩnh điều đó khiến trình duyệt vẽ fallback trước rồi nhảy layout (CLS),
      // nên giữ toàn bộ nội dung liền mạch, đúng thứ tự.
      progressiveChunkSize: Number.POSITIVE_INFINITY,
    },
  )
  // Gom buffer rồi decode một lần để không cắt đôi ký tự UTF-8 tiếng Việt
  const chunks: Buffer[] = []
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk))
  const html = Buffer.concat(chunks).toString('utf8')
  if (OUTLINED_BOUNDARY.test(html)) console.warn(`⚠ ${url}: còn Suspense boundary bị tách khỏi vị trí`)
  return { html, head: renderHeadToString(collector.data) }
}
