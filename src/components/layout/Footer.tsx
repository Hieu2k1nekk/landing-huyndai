import { Link } from 'react-router'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { PLACEHOLDER, dealer, formatAddress, siteConfig, telHref } from '@/config/site'
import { mainNav } from '@/data/navigation'
import { vehicles } from '@/data/vehicles'
import { Logo } from '@/components/ui/Logo'
import { FacebookIcon, YoutubeIcon, ZaloIcon } from '@/components/ui/SocialIcons'

function InfoRow({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-sky-300" aria-hidden />
      <div>
        <p className="text-xs font-medium tracking-wide text-white/50 uppercase">{label}</p>
        <div className="mt-0.5 text-[0.9375rem] text-white/90">{children}</div>
      </div>
    </li>
  )
}

const Placeholder = () => <span className="text-white/60 italic">{PLACEHOLDER}</span>

export function Footer() {
  const address = formatAddress(dealer.address)
  const year = new Date().getFullYear()
  const socials = [
    { href: dealer.social.facebook, label: 'Facebook', icon: FacebookIcon },
    { href: dealer.social.youtube, label: 'YouTube', icon: YoutubeIcon },
    { href: dealer.social.zalo, label: 'Zalo', icon: ZaloIcon },
  ].filter((s) => s.href)

  return (
    <footer className="bg-brand-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Thông tin showroom
      </h2>
      <div className="container-page grid gap-12 pt-16 pb-10 lg:grid-cols-12 lg:gap-8 lg:pt-20">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-white/65">
            {dealer.name || siteConfig.siteName} – tư vấn, báo giá, lái thử và hỗ trợ thủ tục mua xe Hyundai.
            Dịch vụ bảo dưỡng, sửa chữa theo tiêu chuẩn chính hãng.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full bg-white/8 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-4">
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Showroom</h3>
          <ul className="mt-5 space-y-4">
            <InfoRow icon={MapPin} label="Địa chỉ">
              {address ? (
                dealer.mapUrl ? (
                  <a href={dealer.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {address}
                  </a>
                ) : (
                  address
                )
              ) : (
                <Placeholder />
              )}
            </InfoRow>
            <InfoRow icon={Phone} label="Hotline kinh doanh">
              {dealer.hotline ? (
                <a href={telHref(dealer.hotline)} className="font-semibold hover:text-white">
                  {dealer.hotline}
                </a>
              ) : (
                <Placeholder />
              )}
              {dealer.hotlineService && (
                <span className="block text-sm text-white/65">
                  Dịch vụ:{' '}
                  <a href={telHref(dealer.hotlineService)} className="hover:text-white">
                    {dealer.hotlineService}
                  </a>
                </span>
              )}
            </InfoRow>
            <InfoRow icon={Mail} label="Email">
              {dealer.email ? (
                <a href={`mailto:${dealer.email}`} className="hover:text-white">
                  {dealer.email}
                </a>
              ) : (
                <Placeholder />
              )}
            </InfoRow>
            <InfoRow icon={Clock} label="Giờ làm việc">
              {dealer.openingHours.length ? (
                dealer.openingHours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.hours}
                  </span>
                ))
              ) : (
                <Placeholder />
              )}
            </InfoRow>
          </ul>
        </div>

        <nav className="grid grid-cols-2 gap-8 lg:col-span-4" aria-label="Liên kết chân trang">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Liên kết nhanh</h3>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem] text-white/65">
              {mainNav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/chinh-sach-bao-mat" className="transition-colors hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Dòng xe</h3>
            <ul className="mt-5 space-y-2.5 text-[0.9375rem] text-white/65">
              {vehicles.map((v) => (
                <li key={v.slug}>
                  <Link to={`/san-pham/${v.slug}`} className="transition-colors hover:text-white">
                    {v.model}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="container-page">
        {dealer.mapEmbedUrl ? (
          <iframe
            title="Bản đồ đường đến showroom"
            src={dealer.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full rounded-2xl border-0 grayscale-[30%]"
          />
        ) : (
          <div className="flex h-40 items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 text-sm text-white/50">
            <MapPin className="size-4" aria-hidden /> Bản đồ showroom đang được cập nhật
          </div>
        )}
      </div>

      <div className="container-page mt-10 flex flex-col gap-3 border-t border-white/10 py-6 text-xs leading-relaxed text-white/60 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {dealer.name || siteConfig.siteName}. Hyundai và biểu tượng Hyundai là thương hiệu của Hyundai Motor
          Company.
        </p>
        <p>Giá, thông số và hình ảnh mang tính tham khảo.</p>
      </div>
    </footer>
  )
}
