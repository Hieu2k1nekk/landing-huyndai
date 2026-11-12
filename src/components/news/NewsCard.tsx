import { Link } from 'react-router'
import { Clock } from 'lucide-react'
import type { NewsArticle } from '@/types'
import { NEWS_CATEGORY_LABEL } from '@/data/news'
import { formatDate } from '@/utils/format'
import { NewsImage } from '@/components/ui/NewsImage'

export function NewsCard({ article, headingLevel = 'h3' }: { article: NewsArticle; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  const href = `/tin-tuc/${article.slug}`
  return (
    <article className="group flex h-full flex-col">
      <Link to={href} tabIndex={-1} aria-hidden className="block aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-surface">
        <NewsImage
          image={article.image}
          alt={article.imageAlt}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 85vw"
          className="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="font-semibold text-accent">{NEWS_CATEGORY_LABEL[article.category]}</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>
        <H className="mt-2 text-lg leading-snug font-bold sm:text-xl">
          <Link to={href} className="transition-colors hover:text-brand">
            {article.title}
          </Link>
        </H>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] text-muted">{article.excerpt}</p>
        <p className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-muted">
          <Clock className="size-3.5" aria-hidden /> {article.readingMinutes} phút đọc
        </p>
      </div>
    </article>
  )
}
