import { Fragment } from 'react'
import { Link } from 'react-router'
import { Seo } from '@/seo/head'
import { breadcrumbSchema, globalSchemas } from '@/seo/schema'
import { vehicles } from '@/data/vehicles'
import { pricing } from '@/config/site'
import { formatPriceFull } from '@/utils/format'
import { PageHeader, HOME_CRUMB } from '@/components/layout/PageHeader'
import { CarImage } from '@/components/ui/CarImage'
import { PriceNote } from '@/components/ui/PriceNote'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { QuoteLink } from '@/components/forms/QuoteLink'
import { InstallmentSection } from '@/components/installment/InstallmentSection'

const crumbs = [HOME_CRUMB, { name: 'Bảng giá', path: '/bang-gia' }]

const onRoadCosts = [
  ['Lệ phí trước bạ', 'Tính theo % giá tính lệ phí trước bạ, mức áp dụng tùy tỉnh/thành và quy định hiện hành.'],
  ['Phí cấp biển số', 'Khác nhau giữa các khu vực; thường cao hơn tại các thành phố lớn.'],
  ['Phí đăng kiểm', 'Kiểm định an toàn kỹ thuật lần đầu trước khi xe lưu thông.'],
  ['Phí bảo trì đường bộ', 'Thu theo năm hoặc theo chu kỳ đăng kiểm.'],
  ['Bảo hiểm TNDS bắt buộc', 'Bảo hiểm trách nhiệm dân sự bắt buộc của chủ xe cơ giới.'],
  ['Bảo hiểm vật chất (khuyến nghị)', 'Không bắt buộc nhưng nên có, đặc biệt khi mua xe trả góp.'],
] as const

export default function PriceListPage() {
  const label = pricing.verified ? 'niêm yết' : 'tham khảo'
  return (
    <>
      <Seo
        title="Bảng giá xe Hyundai mới nhất"
        description="Bảng giá xe Hyundai các phiên bản: Grand i10, Accent, Elantra, Venue, Creta, Tucson, Santa Fe, Stargazer, Custin, Palisade. Nhận báo giá lăn bánh chi tiết theo tỉnh/thành."
        path="/bang-gia"
        keywords={['bảng giá xe Hyundai', 'giá lăn bánh Hyundai', 'giá xe Hyundai']}
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs)]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Bảng giá"
        title="Bảng giá xe Hyundai"
        description={`Giá ${label} các phiên bản đã bao gồm VAT. Để có giá lăn bánh chính xác theo tỉnh/thành và chương trình ưu đãi hiện hành, vui lòng nhận báo giá.`}
      />

      <section aria-label="Bảng giá các dòng xe" className="section-y">
        <div className="container-page">
          {!pricing.verified && (
            <p role="note" className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Bảng giá đang ở trạng thái <strong>tham khảo</strong> và cần đối chiếu với bảng giá chính thức trước khi
              công bố. Giá thực tế có thể khác – vui lòng liên hệ để được báo giá chính xác.
            </p>
          )}
          <div className="relative overflow-x-auto rounded-[var(--radius-card)] border border-line">
            <table className="price-table w-full sm:min-w-[560px] text-[0.9375rem]">
              <caption className="sr-only">Bảng giá {label} xe Hyundai theo phiên bản</caption>
              <thead className="bg-surface text-sm text-muted">
                <tr>
                  <th scope="col" className="font-semibold">Mẫu xe / Phiên bản</th>
                  <th scope="col" className="text-right! font-semibold">Giá {label} (VNĐ)</th>
                  <th scope="col" className="hidden sm:table-cell"><span className="sr-only">Thao tác</span></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <Fragment key={v.slug}>
                    <tr className="border-t border-line bg-white">
                      <th scope="rowgroup" colSpan={3} className="pt-6!">
                        <Link to={`/san-pham/${v.slug}`} className="group flex items-center gap-4">
                          <span className="w-20 shrink-0 sm:w-24">
                            <CarImage slug={v.slug} alt="" sizes="96px" className="aspect-[2/1]" />
                          </span>
                          <span>
                            <span className="block text-lg font-bold text-ink group-hover:text-brand">{v.name}</span>
                            <span className="text-sm font-normal text-muted">{v.segment} · {v.seats}</span>
                          </span>
                        </Link>
                      </th>
                    </tr>
                    {v.versions.map((ver) => (
                      <tr key={ver.name} className="border-t border-line/60">
                        <th scope="row" className="font-medium sm:pl-32!">{ver.name}</th>
                        <td className="text-right! font-bold whitespace-nowrap text-brand tabular-nums">
                          {formatPriceFull(ver.price)}
                          {ver.price != null && !pricing.verified && '*'}
                        </td>
                        <td className="hidden w-px text-right! sm:table-cell">
                          <QuoteLink vehicle={v.slug} size="sm" variant="ghost">
                            Báo giá
                          </QuoteLink>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <PriceNote className="mt-4" />
        </div>
      </section>

      <section aria-labelledby="onroad-title" className="pb-16 lg:pb-24">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              id="onroad-title"
              eyebrow="Chi phí lăn bánh"
              title="Giá lăn bánh gồm những gì?"
              description="Ngoài giá xe, người mua cần chuẩn bị các khoản phí đăng ký để xe lưu thông hợp pháp. Mức phí thay đổi theo địa phương."
            />
            <QuoteLink className="mt-8">Nhận bảng tính lăn bánh</QuoteLink>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            {onRoadCosts.map(([t, d], i) => (
              <div key={t} className="bg-white p-6">
                <dt className="flex items-center gap-3 font-bold">
                  <span className="text-sm text-accent tabular-nums">0{i + 1}</span>
                  {t}
                </dt>
                <dd className="mt-2 text-[0.9375rem] text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <InstallmentSection />
    </>
  )
}
