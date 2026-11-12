import { Seo } from '@/seo/head'
import { breadcrumbSchema, globalSchemas } from '@/seo/schema'
import { dealer, PLACEHOLDER, siteConfig } from '@/config/site'
import { PageHeader, HOME_CRUMB } from '@/components/layout/PageHeader'

const crumbs = [HOME_CRUMB, { name: 'Chính sách bảo mật', path: '/chinh-sach-bao-mat' }]

const sections: { title: string; body: (string | string[])[] }[] = [
  {
    title: '1. Thông tin chúng tôi thu thập',
    body: [
      'Khi bạn gửi yêu cầu báo giá, đăng ký lái thử hoặc liên hệ tư vấn, chúng tôi có thể thu thập:',
      ['Họ và tên', 'Số điện thoại', 'Dòng xe, phiên bản quan tâm và hình thức thanh toán', 'Tỉnh/thành phố đăng ký xe'],
      'Website không yêu cầu cung cấp thông tin nhạy cảm như số CCCD, thông tin tài khoản ngân hàng qua biểu mẫu trực tuyến.',
    ],
  },
  {
    title: '2. Mục đích sử dụng',
    body: [
      [
        'Liên hệ tư vấn, gửi báo giá và thông tin chương trình bán hàng theo yêu cầu của bạn.',
        'Sắp xếp lịch lái thử, tư vấn phương án tài chính.',
        'Cải thiện chất lượng dịch vụ và trải nghiệm website.',
      ],
    ],
  },
  {
    title: '3. Chia sẻ thông tin',
    body: [
      'Chúng tôi không bán hoặc cho thuê thông tin cá nhân. Thông tin chỉ được chia sẻ khi cần thiết với các đối tác trực tiếp tham gia cung cấp dịch vụ cho bạn (ví dụ: ngân hàng khi bạn yêu cầu tư vấn trả góp, công ty bảo hiểm) hoặc khi cơ quan nhà nước có thẩm quyền yêu cầu theo quy định pháp luật.',
    ],
  },
  {
    title: '4. Lưu trữ và bảo mật',
    body: [
      'Dữ liệu được lưu trữ trong thời gian cần thiết để phục vụ mục đích nêu trên và áp dụng các biện pháp kỹ thuật phù hợp để ngăn chặn truy cập trái phép, mất mát hoặc rò rỉ thông tin.',
    ],
  },
  {
    title: '5. Quyền của bạn',
    body: [
      'Bạn có quyền yêu cầu truy cập, chỉnh sửa, xóa thông tin cá nhân hoặc rút lại sự đồng ý xử lý dữ liệu bất kỳ lúc nào bằng cách liên hệ với chúng tôi theo thông tin bên dưới, phù hợp với quy định của pháp luật Việt Nam về bảo vệ dữ liệu cá nhân.',
    ],
  },
  {
    title: '6. Cookie và công cụ phân tích',
    body: [
      'Website có thể sử dụng cookie và công cụ phân tích lưu lượng truy cập ẩn danh để cải thiện nội dung. Bạn có thể tắt cookie trong cài đặt trình duyệt.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Chính sách bảo mật thông tin"
        description={`Chính sách thu thập, sử dụng và bảo vệ thông tin cá nhân của khách hàng tại ${siteConfig.siteName}.`}
        path="/chinh-sach-bao-mat"
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs)]}
      />
      <PageHeader crumbs={crumbs} eyebrow="Pháp lý" title="Chính sách bảo mật" />
      <div className="container-page">
        <div className="mx-auto max-w-3xl py-12 text-[1.0625rem] leading-[1.8] text-ink/90 lg:py-16">
          <p>
            {dealer.name || siteConfig.siteName} (“chúng tôi”) tôn trọng và cam kết bảo vệ thông tin cá nhân của khách
            hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng website.
          </p>
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mt-10 mb-3 text-2xl font-bold">{s.title}</h2>
              {s.body.map((b, i) =>
                Array.isArray(b) ? (
                  <ul key={i} className="my-4 list-disc space-y-1.5 pl-6 marker:text-accent">
                    {b.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="my-4">
                    {b}
                  </p>
                ),
              )}
            </section>
          ))}
          <section>
            <h2 className="mt-10 mb-3 text-2xl font-bold">7. Liên hệ</h2>
            <p>
              Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ: {dealer.name || PLACEHOLDER} – Hotline:{' '}
              {dealer.hotline || PLACEHOLDER} – Email: {dealer.email || PLACEHOLDER}.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
