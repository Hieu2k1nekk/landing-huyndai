import { useParams } from 'react-router'
import { Clock } from 'lucide-react'
import { Seo } from '@/seo/head'
import { articleSchema, breadcrumbSchema, globalSchemas } from '@/seo/schema'
import { getArticle, NEWS_CATEGORY_LABEL, sortedNews } from '@/data/news'
import { getVehicle } from '@/data/vehicles'
import { formatDate } from '@/utils/format'
import { getNewsImage } from '@/utils/images'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { HOME_CRUMB } from '@/components/layout/PageHeader'
import { NewsImage } from '@/components/ui/NewsImage'
import { NewsCard } from '@/components/news/NewsCard'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { QuoteSection } from '@/components/home/QuoteSection'
import NotFoundPage from './NotFoundPage'

export default function ArticlePage() {
  const { slug = '' } = useParams()
  const a = getArticle(slug)
  if (!a) return <NotFoundPage />

  const crumbs = [HOME_CRUMB, { name: 'Tin tức', path: '/tin-tuc' }, { name: a.title, path: `/tin-tuc/${a.slug}` }]
  const relatedCars = (a.relatedVehicles ?? []).map(getVehicle).filter((v) => v != null).slice(0, 3)
  const more = sortedNews()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3)

  return (
    <>
      <Seo
        title={a.title}
        description={a.excerpt}
        path={`/tin-tuc/${a.slug}`}
        image={getNewsImage(a.image)?.src}
        imageAlt={a.imageAlt}
        type="article"
        article={{
          publishedTime: a.publishedAt,
          modifiedTime: a.updatedAt,
          section: NEWS_CATEGORY_LABEL[a.category],
        }}
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs), articleSchema(a)]}
      />

      <article>
        <header className="container-page pt-8 lg:pt-10">
          <Breadcrumbs items={crumbs} className="[&_li:last-child]:hidden sm:[&_li:last-child]:inline-flex" />
          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="font-semibold text-accent">{NEWS_CATEGORY_LABEL[a.category]}</span>
              <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden /> {a.readingMinutes} phút đọc
              </span>
            </p>
            <h1 className="mt-4 text-[2rem] font-bold sm:text-[2.75rem]">{a.title}</h1>
            <p className="mt-5 text-lg text-muted">{a.excerpt}</p>
          </div>
          <div className="mx-auto mt-10 aspect-[3/2] max-w-5xl overflow-hidden rounded-[1.5rem] sm:aspect-[2/1]">
            <NewsImage image={a.image} alt={a.imageAlt} priority sizes="(min-width: 1024px) 1024px, 100vw" />
          </div>
        </header>

        <div className="container-page">
          <div className="mx-auto max-w-[44rem] py-12 text-[1.0625rem] leading-[1.8] text-ink/90 lg:py-16">
            {a.body.map((b, i) => {
              if (b.type === 'h2')
                return (
                  <h2 key={i} className="mt-10 mb-4 text-2xl font-bold">
                    {b.text}
                  </h2>
                )
              if (b.type === 'ul')
                return (
                  <ul key={i} className="my-5 list-disc space-y-2 pl-6 marker:text-accent">
                    {b.items?.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                )
              return (
                <p key={i} className="my-5">
                  {b.text}
                </p>
              )
            })}
            <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
              Thông tin mang tính tham khảo, có thể thay đổi theo quy định và chính sách tại từng thời điểm.
            </p>
          </div>
        </div>
      </article>

      {relatedCars.length > 0 && (
        <section aria-labelledby="article-cars" className="bg-surface py-16 lg:py-20">
          <div className="container-page">
            <h2 id="article-cars" className="text-2xl font-bold sm:text-3xl">
              Mẫu xe được nhắc đến
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {relatedCars.map((v) => (
                <li key={v.slug}>
                  <VehicleCard vehicle={v} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="more-news" className="section-y">
        <div className="container-page">
          <h2 id="more-news" className="text-2xl font-bold sm:text-3xl">
            Bài viết khác
          </h2>
          <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((x) => (
              <li key={x.slug}>
                <NewsCard article={x} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <QuoteSection />
    </>
  )
}
