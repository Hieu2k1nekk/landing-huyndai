import { Link } from 'react-router'
import { Seo } from '@/seo/head'
import { breadcrumbSchema, globalSchemas } from '@/seo/schema'
import { NEWS_CATEGORY_LABEL, sortedNews } from '@/data/news'
import { formatDate } from '@/utils/format'
import { PageHeader, HOME_CRUMB } from '@/components/layout/PageHeader'
import { NewsCard } from '@/components/news/NewsCard'
import { NewsImage } from '@/components/ui/NewsImage'

const crumbs = [HOME_CRUMB, { name: 'Tin tức', path: '/tin-tuc' }]

export default function NewsPage() {
  const [lead, ...rest] = sortedNews()
  return (
    <>
      <Seo
        title="Tin tức & kinh nghiệm mua xe Hyundai"
        description="Cẩm nang mua xe Hyundai: chi phí lăn bánh, so sánh mẫu xe, kinh nghiệm trả góp, hướng dẫn sử dụng và lái xe an toàn."
        path="/tin-tuc"
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs)]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Tin tức"
        title="Tin tức & Kinh nghiệm"
        description="Kiến thức hữu ích giúp bạn chọn mua và sử dụng xe Hyundai hiệu quả."
      />
      <section aria-label="Danh sách bài viết" className="section-y">
        <div className="container-page">
          {lead && (
            <article className="group grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
              <Link to={`/tin-tuc/${lead.slug}`} tabIndex={-1} aria-hidden className="block aspect-[3/2] overflow-hidden rounded-[var(--radius-card)]">
                <NewsImage
                  image={lead.image}
                  alt={lead.imageAlt}
                  priority
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>
              <div>
                <p className="flex gap-3 text-sm text-muted">
                  <span className="font-semibold text-accent">{NEWS_CATEGORY_LABEL[lead.category]}</span>
                  <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
                </p>
                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  <Link to={`/tin-tuc/${lead.slug}`} className="hover:text-brand">
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-4 text-muted sm:text-lg">{lead.excerpt}</p>
              </div>
            </article>
          )}
          <ul className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <li key={a.slug}>
                <NewsCard article={a} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
