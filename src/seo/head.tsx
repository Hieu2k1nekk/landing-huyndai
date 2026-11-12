import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { siteConfig } from '@/config/site'

/**
 * Head manager tối giản (không phụ thuộc thư viện):
 *  - Server/prerender: <Seo> ghi metadata vào HeadCollector -> chèn vào <head> HTML tĩnh.
 *  - Client: <Seo> cập nhật document.head khi chuyển route.
 * Mỗi trang render đúng MỘT <Seo>.
 */

export interface SeoData {
  title: string
  description: string
  /** Đường dẫn tương đối, ví dụ "/san-pham/tucson" */
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  keywords?: string[]
  jsonLd?: Record<string, unknown>[]
  article?: { publishedTime: string; modifiedTime?: string; section?: string }
}

export class HeadCollector {
  data: SeoData | null = null
}

const HeadContext = createContext<HeadCollector | null>(null)

export function HeadProvider({ collector, children }: { collector?: HeadCollector; children: ReactNode }) {
  return <HeadContext.Provider value={collector ?? null}>{children}</HeadContext.Provider>
}

export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteConfig.siteUrl}${path.startsWith('/') ? '' : '/'}${path}`

const fullTitle = (title: string) =>
  title.includes(siteConfig.siteName) ? title : `${title} | ${siteConfig.siteName}`

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** JSON an toàn khi nhúng trong <script> */
const safeJson = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c')

type Tag =
  | { kind: 'meta'; attr: 'name' | 'property'; key: string; content: string }
  | { kind: 'link'; rel: string; href: string }

function buildTags(d: SeoData): Tag[] {
  const url = absoluteUrl(d.path)
  const image = absoluteUrl(d.image ?? siteConfig.defaultOgImage)
  const title = fullTitle(d.title)
  const tags: Tag[] = [
    { kind: 'meta', attr: 'name', key: 'description', content: d.description },
    { kind: 'meta', attr: 'name', key: 'robots', content: d.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' },
    { kind: 'link', rel: 'canonical', href: url },
    { kind: 'meta', attr: 'property', key: 'og:type', content: d.type === 'article' ? 'article' : 'website' },
    { kind: 'meta', attr: 'property', key: 'og:site_name', content: siteConfig.siteName },
    { kind: 'meta', attr: 'property', key: 'og:locale', content: siteConfig.locale },
    { kind: 'meta', attr: 'property', key: 'og:title', content: title },
    { kind: 'meta', attr: 'property', key: 'og:description', content: d.description },
    { kind: 'meta', attr: 'property', key: 'og:url', content: url },
    { kind: 'meta', attr: 'property', key: 'og:image', content: image },
    { kind: 'meta', attr: 'property', key: 'og:image:alt', content: d.imageAlt ?? title },
    { kind: 'meta', attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { kind: 'meta', attr: 'name', key: 'twitter:title', content: title },
    { kind: 'meta', attr: 'name', key: 'twitter:description', content: d.description },
    { kind: 'meta', attr: 'name', key: 'twitter:image', content: image },
  ]
  if (siteConfig.twitterHandle)
    tags.push({ kind: 'meta', attr: 'name', key: 'twitter:site', content: siteConfig.twitterHandle })
  if (d.keywords?.length) tags.push({ kind: 'meta', attr: 'name', key: 'keywords', content: d.keywords.join(', ') })
  if (d.article) {
    tags.push({ kind: 'meta', attr: 'property', key: 'article:published_time', content: d.article.publishedTime })
    if (d.article.modifiedTime)
      tags.push({ kind: 'meta', attr: 'property', key: 'article:modified_time', content: d.article.modifiedTime })
    if (d.article.section)
      tags.push({ kind: 'meta', attr: 'property', key: 'article:section', content: d.article.section })
  }
  return tags
}

/** Dùng trong prerender: chuỗi HTML chèn vào <head> */
export function renderHeadToString(d: SeoData | null): string {
  if (!d) return ''
  const out = [`<title>${esc(fullTitle(d.title))}</title>`]
  for (const t of buildTags(d)) {
    out.push(
      t.kind === 'meta'
        ? `<meta ${t.attr}="${t.key}" content="${esc(t.content)}" data-seo="">`
        : `<link rel="${t.rel}" href="${esc(t.href)}" data-seo="">`,
    )
  }
  for (const ld of d.jsonLd ?? []) out.push(`<script type="application/ld+json" data-seo="">${safeJson(ld)}</script>`)
  return out.join('\n    ')
}

function applyToDocument(d: SeoData) {
  document.title = fullTitle(d.title)
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  const frag = document.createDocumentFragment()
  for (const t of buildTags(d)) {
    const el = document.createElement(t.kind)
    if (t.kind === 'meta') {
      el.setAttribute(t.attr, t.key)
      el.setAttribute('content', t.content)
    } else {
      el.setAttribute('rel', t.rel)
      el.setAttribute('href', t.href)
    }
    el.setAttribute('data-seo', '')
    frag.appendChild(el)
  }
  for (const ld of d.jsonLd ?? []) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.setAttribute('data-seo', '')
    s.textContent = safeJson(ld)
    frag.appendChild(s)
  }
  document.head.appendChild(frag)
}

export function Seo(props: SeoData) {
  const collector = useContext(HeadContext)
  if (collector) collector.data = props // chạy trong lúc render phía server

  const key = JSON.stringify(props)
  useEffect(() => {
    applyToDocument(props)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return null
}
