import { useParams } from 'react-router'
import { Check, ExternalLink } from 'lucide-react'
import { Seo } from '@/seo/head'
import { breadcrumbSchema, globalSchemas, vehicleProductSchema } from '@/seo/schema'
import { BODY_TYPE_LABEL, getStartingPrice, getVehicle, vehicles } from '@/data/vehicles'
import { pricing } from '@/config/site'
import { formatPriceFull, formatPriceShort } from '@/utils/format'
import { getCarImage } from '@/utils/images'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { HOME_CRUMB } from '@/components/layout/PageHeader'
import { CarImage } from '@/components/ui/CarImage'
import { PriceNote } from '@/components/ui/PriceNote'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { QuoteSection } from '@/components/home/QuoteSection'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import NotFoundPage from './NotFoundPage'

export default function VehicleDetailPage() {
  const { slug = '' } = useParams()
  const v = getVehicle(slug)
  if (!v) return <NotFoundPage />

  const price = getStartingPrice(v)
  const crumbs = [HOME_CRUMB, { name: 'Sản phẩm', path: '/san-pham' }, { name: v.name, path: `/san-pham/${v.slug}` }]
  const related = vehicles
    .filter((x) => x.slug !== v.slug)
    .sort((a, b) => Number(b.bodyType === v.bodyType) - Number(a.bodyType === v.bodyType))
    .slice(0, 3)
  const img = getCarImage(v.slug)

  return (
    <>
      <Seo
        title={`${v.name} – Giá xe, thông số, phiên bản`}
        description={`${v.name}: ${v.description} Giá ${pricing.verified ? 'niêm yết' : 'tham khảo'} từ ${formatPriceShort(price)}. Nhận báo giá lăn bánh và ưu đãi.`}
        path={`/san-pham/${v.slug}`}
        image={img?.src}
        imageAlt={v.imageAlt}
        type="product"
        keywords={v.seoKeywords}
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs), vehicleProductSchema(v)]}
      />

      {/* Hero sản phẩm */}
      <section className="relative overflow-hidden bg-surface">
        {/* Desktop: nền tối chỉ nằm sau cột ảnh xe, không đè lên giá/nút ở cột chữ */}
        <div
          aria-hidden
          className="showroom-panel absolute right-0 bottom-0 hidden h-[42%] w-[55%] rounded-tl-[3rem] lg:block"
        />
        <div className="container-page relative pt-8 lg:pt-10">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5 lg:pb-[22%]">
              <p className="eyebrow mb-4">
                <span className="h-px w-6 bg-accent" aria-hidden />
                {v.segment}
              </p>
              <h1 className="text-[2.25rem] font-bold sm:text-5xl lg:text-[3.5rem]">{v.name}</h1>
              <p className="mt-3 text-lg text-ink/80">{v.tagline}</p>
              <div className="mt-6">
                <p className="text-sm text-muted">Giá {pricing.verified ? 'niêm yết' : 'tham khảo'} từ</p>
                <p className="text-3xl font-bold text-brand">
                  {formatPriceShort(price)}
                  {price != null && !pricing.verified && <span className="align-super text-base text-muted">*</span>}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <QuoteLink vehicle={v.slug} size="lg">
                  Nhận báo giá lăn bánh
                </QuoteLink>
              </div>
            </div>
            <div className="relative -mx-5 md:-mx-8 lg:col-span-7 lg:mx-0">
              {/* Mobile/tablet: nền tối chỉ phía sau ảnh xe (cột chữ nằm phía trên) */}
              <div aria-hidden className="showroom-panel absolute inset-x-0 top-[40%] bottom-0 lg:hidden" />
              <div className="relative px-7 pb-8 sm:px-11 md:px-14 lg:px-6">
                <CarImage
                  slug={v.slug}
                  alt={v.imageAlt}
                  priority
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="relative z-[1] aspect-[2/1] drop-shadow-[0_30px_30px_rgb(0_20_45/0.35)]"
                />
                <div className="car-shadow" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thông số nổi bật */}
      <section aria-label="Thông số nổi bật" className="border-b border-line bg-white">
        <dl className="container-page grid grid-cols-2 divide-line py-2 sm:grid-cols-4 sm:divide-x">
          {v.highlights.map((h) => (
            <div key={h.label} className="px-1 py-5 sm:px-6 sm:first:pl-0">
              <dt className="text-sm text-muted">{h.label}</dt>
              <dd className="mt-1 text-lg font-bold">{h.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Tổng quan + trang bị */}
      <section aria-labelledby="overview-title" className="section-y">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading id="overview-title" eyebrow="Tổng quan" title={`Giới thiệu ${v.name}`} />
            <div className="mt-6 space-y-4 text-[1.0625rem] text-ink/85">
              {v.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <a
              href={v.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Xem thông số kỹ thuật chính thức <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius-card)] bg-surface p-6 sm:p-8">
              <h2 className="text-xl font-bold">Trang bị nổi bật</h2>
              <ul className="mt-5 space-y-3.5">
                {v.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-[0.9375rem]">{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-muted">Trang bị có thể khác nhau tùy phiên bản và thời điểm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Phiên bản & giá */}
      <section aria-labelledby="versions-title" className="pb-16 lg:pb-24">
        <div className="container-page">
          <SectionHeading id="versions-title" eyebrow="Phiên bản" title="Phiên bản & giá tham khảo" />
          <div className="relative mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line">
            <table className="price-table w-full sm:min-w-[480px] text-[0.9375rem]">
              <caption className="sr-only">Bảng giá các phiên bản {v.name}</caption>
              <thead className="bg-surface text-sm text-muted">
                <tr>
                  <th scope="col" className="font-semibold">Phiên bản</th>
                  <th scope="col" className="hidden font-semibold sm:table-cell">Kiểu dáng</th>
                  <th scope="col" className="text-right! font-semibold">
                    Giá {pricing.verified ? 'niêm yết' : 'tham khảo'} (VNĐ)
                  </th>
                  <th scope="col" className="hidden sm:table-cell"><span className="sr-only">Thao tác</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {v.versions.map((ver) => (
                  <tr key={ver.name}>
                    <th scope="row" className="font-semibold">{ver.name}</th>
                    <td className="hidden text-muted sm:table-cell">{BODY_TYPE_LABEL[v.bodyType]}</td>
                    <td className="text-right! font-bold whitespace-nowrap text-brand tabular-nums">
                      {formatPriceFull(ver.price)}
                      {ver.price != null && !pricing.verified && '*'}
                    </td>
                    <td className="hidden text-right! sm:table-cell">
                      <QuoteLink vehicle={v.slug} size="sm" variant="ghost">
                        Báo giá
                      </QuoteLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PriceNote className="mt-4" />
        </div>
      </section>

      <QuoteSection defaultVehicle={v.slug} title={`Nhận báo giá ${v.name}`} />

      <section aria-labelledby="related-title" className="section-y">
        <div className="container-page">
          <SectionHeading id="related-title" eyebrow="Có thể bạn quan tâm" title="Mẫu xe khác" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map((r) => (
              <li key={r.slug}>
                <VehicleCard vehicle={r} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
