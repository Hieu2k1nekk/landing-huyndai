import { Cog, PenTool, ShieldCheck, Wrench, BadgeCheck } from 'lucide-react'
import { NewsImage } from '@/components/ui/NewsImage'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

const reasons = [
  {
    icon: PenTool,
    title: 'Thiết kế Sensuous Sportiness',
    text: 'Ngôn ngữ thiết kế “Thể thao cảm xúc” với đường nét hiện đại, đèn LED đặc trưng và tỷ lệ thân xe cân đối.',
  },
  {
    icon: ShieldCheck,
    title: 'Công nghệ an toàn Hyundai SmartSense',
    text: 'Gói hỗ trợ lái thông minh: cảnh báo va chạm, hỗ trợ giữ làn, kiểm soát hành trình thích ứng (tùy phiên bản).',
  },
  {
    icon: Cog,
    title: 'Động cơ Smartstream hiệu quả',
    text: 'Thế hệ động cơ tối ưu cảm giác lái và mức tiêu hao nhiên liệu, cùng lựa chọn hybrid trên một số dòng xe.',
  },
  {
    icon: Wrench,
    title: 'Mạng lưới dịch vụ rộng khắp',
    text: 'Hệ thống đại lý và xưởng dịch vụ chính hãng trên toàn quốc, phụ tùng sẵn có, chi phí bảo dưỡng hợp lý.',
  },
  {
    icon: BadgeCheck,
    title: 'Bảo hành chính hãng',
    text: 'Xe được bảo hành theo chính sách của Hyundai Thành Công Việt Nam, áp dụng tại mọi đại lý ủy quyền.',
  },
]

export function WhyHyundai() {
  return (
    <section aria-labelledby="why-title" className="section-y bg-white">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[4/3] lg:aspect-[4/5]">
            <NewsImage
              image="tucson-hev-run1"
              alt="Hyundai Tucson Hybrid đang di chuyển trên đường ven biển"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent" />
            <p className="absolute right-6 bottom-6 left-6 text-lg font-semibold text-white sm:text-xl">
              “Progress for Humanity” – tiến bộ vì con người.
            </p>
          </div>
          <div
            aria-hidden
            className="absolute -bottom-5 -left-5 -z-10 hidden size-40 rounded-[2rem] bg-surface sm:block"
          />
        </Reveal>

        <div>
          <SectionHeading
            id="why-title"
            eyebrow="Vì sao chọn Hyundai"
            title="Giá trị bền vững trên mỗi hành trình"
            description="Hyundai là một trong những thương hiệu ô tô được ưa chuộng tại Việt Nam nhờ sự cân bằng giữa thiết kế, công nghệ và chi phí sở hữu."
          />
          <ul className="mt-10 divide-y divide-line">
            {reasons.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 60} className="flex gap-5 py-5 first:pt-0 last:pb-0">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/[0.06] text-brand">
                  <Icon className="size-5.5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-[0.9375rem] text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
