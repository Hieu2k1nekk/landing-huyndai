import { dealer, formatAddress, isDealerConfigured, pricing, siteConfig } from '@/config/site'
import { getStartingPrice } from '@/data/vehicles'
import { NEWS_CATEGORY_LABEL } from '@/data/news'
import type { NewsArticle, Vehicle } from '@/types'
import { getCarImage, getNewsImage } from '@/utils/images'
import { absoluteUrl } from './head'

/**
 * Structured data (Schema.org).
 * Nguyên tắc: KHÔNG xuất dữ liệu giả. Doanh nghiệp/địa chỉ chỉ xuất khi
 * đã cấu hình; giá (Offer) chỉ xuất khi pricing.verified = true.
 */

const ORG_ID = `${siteConfig.siteUrl}/#organization`
const SITE_ID = `${siteConfig.siteUrl}/#website`

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: siteConfig.siteUrl,
    name: siteConfig.siteName,
    inLanguage: 'vi-VN',
    ...(isDealerConfigured ? { publisher: { '@id': ORG_ID } } : {}),
  }
}

/** AutoDealer (kế thừa LocalBusiness + Organization) – chỉ khi đủ thông tin thật */
export function dealerSchema() {
  if (!isDealerConfigured) return null
  const sameAs = [dealer.social.facebook, dealer.social.youtube, dealer.social.tiktok].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': ORG_ID,
    name: dealer.name,
    ...(dealer.legalName ? { legalName: dealer.legalName } : {}),
    url: siteConfig.siteUrl,
    logo: absoluteUrl('/logo.png'),
    image: absoluteUrl(siteConfig.defaultOgImage),
    telephone: dealer.hotline,
    ...(dealer.email ? { email: dealer.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: [dealer.address.street, dealer.address.ward].filter(Boolean).join(', '),
      addressLocality: dealer.address.city,
      ...(dealer.address.postalCode ? { postalCode: dealer.address.postalCode } : {}),
      addressCountry: 'VN',
    },
    ...(dealer.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: dealer.geo.latitude, longitude: dealer.geo.longitude } }
      : {}),
    ...(dealer.openingHours.length ? { openingHours: dealer.openingHours.map((h) => h.schema) } : {}),
    ...(dealer.mapUrl ? { hasMap: dealer.mapUrl } : {}),
    brand: { '@type': 'Brand', name: 'Hyundai' },
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: formatAddress(dealer.address) ? dealer.address.city : undefined,
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

export function vehicleProductSchema(v: Vehicle) {
  const img = getCarImage(v.slug)
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Car'],
    name: v.name,
    description: v.description,
    url: absoluteUrl(`/san-pham/${v.slug}`),
    brand: { '@type': 'Brand', name: 'Hyundai' },
    manufacturer: { '@type': 'Organization', name: 'Hyundai Motor Company' },
    model: v.model,
    bodyType: v.bodyType.toUpperCase(),
    vehicleSeatingCapacity: v.seats,
    category: v.segment,
    ...(img ? { image: absoluteUrl(img.src) } : {}),
  }
  const from = getStartingPrice(v)
  if (pricing.verified && from != null) {
    const prices = v.versions.map((x) => x.price).filter((p): p is number => p != null)
    base.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: pricing.currency,
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: 'https://schema.org/InStock',
      ...(isDealerConfigured ? { seller: { '@id': ORG_ID } } : {}),
    }
  }
  return base
}

export function vehicleListSchema(list: Vehicle[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Các dòng xe Hyundai',
    itemListElement: list.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/san-pham/${v.slug}`),
      name: v.name,
    })),
  }
}

export function articleSchema(a: NewsArticle) {
  const img = getNewsImage(a.image)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    articleSection: NEWS_CATEGORY_LABEL[a.category],
    inLanguage: 'vi-VN',
    datePublished: a.publishedAt,
    dateModified: a.updatedAt ?? a.publishedAt,
    mainEntityOfPage: absoluteUrl(`/tin-tuc/${a.slug}`),
    ...(img ? { image: [absoluteUrl(img.src)] } : {}),
    author: isDealerConfigured
      ? { '@id': ORG_ID }
      : { '@type': 'Organization', name: siteConfig.siteName, url: siteConfig.siteUrl },
    publisher: isDealerConfigured
      ? { '@id': ORG_ID }
      : { '@type': 'Organization', name: siteConfig.siteName, url: siteConfig.siteUrl },
  }
}

/** Schema chung cho mọi trang */
export const globalSchemas = () =>
  [websiteSchema(), dealerSchema()].filter(Boolean) as Record<string, unknown>[]
