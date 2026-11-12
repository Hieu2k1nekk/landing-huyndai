import { NewsImage } from '@/components/ui/NewsImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

const reasons = [
  {
    title: 'Thiết kế Sensuous Sportiness',
    text: 'Ngôn ngữ thiết kế “Thể thao cảm xúc” với đường nét hiện đại, đèn LED đặc trưng và tỷ lệ thân xe cân đối.',
  },
  {
    title: 'Công nghệ an toàn Hyundai SmartSense',
    text: 'Gói hỗ trợ lái thông minh: cảnh báo va chạm, hỗ trợ giữ làn, kiểm soát hành trình thích ứng (tùy phiên bản).',
  },
  {
    title: 'Động cơ Smartstream hiệu quả',
    text: 'Thế hệ động cơ tối ưu cảm giác lái và mức tiêu hao nhiên liệu, cùng lựa chọn hybrid trên một số dòng xe.',
  },
  {
    title: 'Mạng lưới dịch vụ rộng khắp',
    text: 'Hệ thống đại lý và xưởng dịch vụ chính hãng trên toàn quốc, phụ tùng sẵn có, chi phí bảo dưỡng hợp lý.',
  },
  {
    title: 'Bảo hành chính hãng',
    text: 'Xe được bảo hành theo chính sách của Hyundai Thành Công Việt Nam, áp dụng tại mọi đại lý ủy quyền.',
  },
]

export function WhyHyundai() {
  return (
    <section aria-labelledby="why-title" className="section-y bg-white">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="why-title"
              eyebrow="Vì sao chọn Hyundai"
              title="Giá trị bền vững trên mỗi hành trình"
              description="Hyundai là một trong những thương hiệu ô tô được ưa chuộng tại Việt Nam nhờ sự cân bằng giữa thiết kế, công nghệ và chi phí sở hữu."
            />
            <Reveal className="relative mt-10 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)]">
              <NewsImage
                image="palisade-0056"
                alt="Hyundai Palisade thế hệ mới màu trắng trên cung đường đèo"
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, 100vw"
              />
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {reasons.map(({ title, text }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 60}
              className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] lg:py-10"
            >
              <span aria-hidden className="text-4xl leading-none font-bold tracking-tight text-brand/15 tabular-nums sm:text-5xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
                <p className="mt-2 max-w-xl text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
