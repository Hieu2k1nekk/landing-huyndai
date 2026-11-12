import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import HomePage from '@/pages/HomePage'
import { vehicles } from '@/data/vehicles'
import { news } from '@/data/news'

type Loader = () => Promise<{ default: ComponentType }>

interface PageRoute {
  path: string
  load?: Loader
  Component: ComponentType | LazyExoticComponent<ComponentType>
}

/** Trang chủ nạp sẵn (LCP); các trang khác tách chunk */
function lazyRoute(path: string, load: Loader): PageRoute {
  return { path, load, Component: lazy(load) }
}

export const pageRoutes: PageRoute[] = [
  { path: '/', Component: HomePage },
  lazyRoute('/san-pham', () => import('@/pages/ProductsPage')),
  lazyRoute('/san-pham/:slug', () => import('@/pages/VehicleDetailPage')),
  lazyRoute('/bang-gia', () => import('@/pages/PriceListPage')),
  lazyRoute('/khuyen-mai', () => import('@/pages/PromotionsPage')),
  lazyRoute('/tin-tuc', () => import('@/pages/NewsPage')),
  lazyRoute('/tin-tuc/:slug', () => import('@/pages/ArticlePage')),
  lazyRoute('/lien-he', () => import('@/pages/ContactPage')),
  lazyRoute('/chinh-sach-bao-mat', () => import('@/pages/PrivacyPage')),
  lazyRoute('*', () => import('@/pages/NotFoundPage')),
]

/** Danh sách URL cần prerender (cũng dùng để sinh sitemap.xml) */
export const prerenderPaths: { path: string; priority: number; changefreq: string; lastmod?: string }[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/san-pham', priority: 0.9, changefreq: 'weekly' },
  ...vehicles.map((v) => ({ path: `/san-pham/${v.slug}`, priority: 0.9, changefreq: 'weekly' })),
  { path: '/bang-gia', priority: 0.9, changefreq: 'weekly' },
  { path: '/khuyen-mai', priority: 0.8, changefreq: 'weekly' },
  { path: '/tin-tuc', priority: 0.7, changefreq: 'weekly' },
  ...news.map((a) => ({
    path: `/tin-tuc/${a.slug}`,
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: a.updatedAt ?? a.publishedAt,
  })),
  { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
  { path: '/chinh-sach-bao-mat', priority: 0.3, changefreq: 'yearly' },
]
