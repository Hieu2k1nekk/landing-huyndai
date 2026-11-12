import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Seo } from "@/seo/head";
import { breadcrumbSchema, globalSchemas } from "@/seo/schema";
import { dealer, formatAddress, PLACEHOLDER, telHref } from "@/config/site";
import { PageHeader, HOME_CRUMB } from "@/components/layout/PageHeader";
import { QuoteSection } from "@/components/home/QuoteSection";

const crumbs = [HOME_CRUMB, { name: "Liên hệ", path: "/lien-he" }];

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    // <dl> chỉ cho phép nhóm <div> chứa dt/dd -> icon đặt bên trong <dt>, định vị tuyệt đối
    <div className="relative min-w-0 rounded-[var(--radius-card)] border border-line bg-white p-5 pl-20">
      <dt className="text-sm text-muted">
        <span className="absolute top-5 left-5 grid size-11 place-items-center rounded-xl bg-accent/10 text-accent">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold break-words">{children}</dd>
    </div>
  );
}

const Pending = () => (
  <span className="font-normal text-muted italic">{PLACEHOLDER}</span>
);

export default function ContactPage() {
  const address = formatAddress(dealer.address);
  return (
    <>
      <Seo
        title="Liên hệ – Nhận báo giá & đăng ký lái thử"
        description="Liên hệ showroom Hyundai để nhận báo giá lăn bánh, tư vấn trả góp, đăng ký lái thử và đặt lịch dịch vụ."
        path="/lien-he"
        jsonLd={[...globalSchemas(), breadcrumbSchema(crumbs)]}
      />
      <PageHeader
        crumbs={crumbs}
        eyebrow="Liên hệ"
        title="Liên hệ showroom"
        description="Để lại thông tin để nhận báo giá, hoặc liên hệ trực tiếp với chúng tôi qua các kênh dưới đây."
      >
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoRow
            icon={<Phone className="size-5" aria-hidden />}
            label="Hotline"
          >
            {dealer.hotline ? (
              <a
                href={telHref(dealer.hotline)}
                className="text-brand hover:underline"
              >
                {dealer.hotline}
              </a>
            ) : (
              <Pending />
            )}
          </InfoRow>
          <InfoRow
            icon={<MapPin className="size-5" aria-hidden />}
            label="Địa chỉ showroom"
          >
            {address ? (
              dealer.mapUrl ? (
                <a
                  href={dealer.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand"
                >
                  {address}
                </a>
              ) : (
                address
              )
            ) : (
              <Pending />
            )}
          </InfoRow>
          <InfoRow icon={<Mail className="size-5" aria-hidden />} label="Email">
            {dealer.email ? (
              <a href={`mailto:${dealer.email}`} className="hover:text-brand">
                {dealer.email}
              </a>
            ) : (
              <Pending />
            )}
          </InfoRow>
          <InfoRow
            icon={<Clock className="size-5" aria-hidden />}
            label="Giờ làm việc"
          >
            {dealer.openingHours.length ? (
              dealer.openingHours.map((h) => (
                <span key={h.days + h.hours} className="block">
                  {h.days ? `${h.days}: ` : ""}
                  {h.hours}
                </span>
              ))
            ) : (
              <Pending />
            )}
          </InfoRow>
        </dl>
      </PageHeader>

      <QuoteSection />

      {dealer.mapEmbedUrl && (
        <section
          aria-label="Bản đồ showroom"
          className="container-page pb-16 lg:pb-24"
        >
          <iframe
            title="Bản đồ đường đi tới showroom"
            src={dealer.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full rounded-[var(--radius-card)] border-0"
          />
        </section>
      )}
    </>
  );
}
