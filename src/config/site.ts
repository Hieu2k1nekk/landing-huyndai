/**
 * CẤU HÌNH SHOWROOM
 * ---------------------------------------------------------------------------
 * Toàn bộ thông tin doanh nghiệp được tập trung tại đây để dễ thay đổi.
 * ⚠ Các trường đang để trống là CỐ Ý: website không tự tạo địa chỉ, hotline,
 *   email hay thông tin pháp lý giả. Hãy điền thông tin THẬT của showroom.
 *
 * Khi trống:
 *  - UI hiển thị "Đang cập nhật" (hoặc ẩn nút tương ứng).
 *  - Schema AutoDealer/LocalBusiness KHÔNG được xuất ra (tránh dữ liệu sai).
 *
 * Có thể ghi đè một số giá trị bằng biến môi trường (xem .env.example).
 */

const env = import.meta.env;

export const siteConfig = {
  /** Domain chính thức (không có dấu / ở cuối) – dùng cho canonical, sitemap, OG. */
  siteUrl: (env.VITE_SITE_URL || "https://hyundai-showroom.example").replace(
    /\/$/,
    "",
  ),
  /** Tên thương hiệu hiển thị trên website/tiêu đề trang. */
  siteName: env.VITE_SITE_NAME || "Hyundai Showroom",
  locale: "vi_VN",
  defaultOgImage: "/og-default.jpg",
  twitterHandle: "",
} as const;

export interface DealerInfo {
  /** Tên pháp lý/tên đại lý, ví dụ: "Hyundai ABC" */
  name: string;
  legalName: string;
  address: {
    street: string;
    ward: string;
    city: string; // Tỉnh/Thành phố
    postalCode: string;
  };
  /** Số điện thoại hiển thị, ví dụ "0912 345 678" */
  hotline: string;
  hotlineService: string;
  email: string;
  /** Ví dụ: [{ days: 'Thứ 2 – Chủ nhật', hours: '08:00 – 18:00', schema: 'Mo-Su 08:00-18:00' }] */
  openingHours: { days: string; hours: string; schema: string }[];
  /** URL nhúng Google Maps (Share → Embed a map → copy src của iframe) */
  mapEmbedUrl: string;
  /** Link Google Maps để mở chỉ đường */
  mapUrl: string;
  geo: { latitude: number; longitude: number } | null;
  social: {
    zalo: string; // https://zalo.me/<số điện thoại hoặc OA>
    messenger: string; // https://m.me/<page>
    facebook: string;
    youtube: string;
    tiktok: string;
  };
}

const ADDRESS_QUERY = "KCN Gián Khẩu, Gia Trấn, Ninh Bình";

export const dealer: DealerInfo = {
  name: "",
  legalName: "",
  address: {
    street: "Quốc lộ 1A - KCN Gián Khẩu",
    ward: "Xã Gia Trấn",
    city: "Ninh Bình",
    postalCode: "",
  },
  hotline: env.VITE_DEALER_HOTLINE || "0965.66.33.86",
  hotlineService: "",
  email: "huongdtt.hyundainb@gmail.com",
  /** days để trống = chưa xác định ngày trong tuần (chỉ hiện giờ). schema chỉ điền khi biết rõ ngày, ví dụ 'Mo-Sa 07:30-17:00' */
  openingHours: [{ days: "", hours: "07:30 – 17:00", schema: "" }],
  /** Tạo từ địa chỉ ở trên (tìm kiếm theo địa chỉ). Có toạ độ/link ghim chính xác thì thay vào. */
  mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&z=15&output=embed`,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_QUERY)}`,
  geo: null,
  social: {
    zalo: env.VITE_DEALER_ZALO || "https://zalo.me/0965663386",
    messenger: env.VITE_DEALER_MESSENGER || "",
    facebook: "",
    youtube: "",
    tiktok: "",
  },
};

/** Thông tin đã đủ để xuất structured data AutoDealer/LocalBusiness hay chưa */
export const isDealerConfigured = Boolean(
  dealer.name && dealer.hotline && dealer.address.street && dealer.address.city,
);

export const PLACEHOLDER = "Đang cập nhật";

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const formatAddress = (a: DealerInfo["address"]) =>
  [a.street, a.ward, a.city].filter(Boolean).join(", ");

/**
 * Trạng thái dữ liệu giá. Đặt `verified: true` và cập nhật `reviewedAt`
 * SAU KHI đã đối chiếu bảng giá chính thức của Hyundai Thành Công.
 * Khi `verified = false`: giá hiển thị kèm ghi chú "tham khảo" và schema
 * Product KHÔNG chứa Offer/giá.
 */
export const pricing = {
  verified: false,
  reviewedAt: "" as string, // ISO date, ví dụ '2026-11-01'
  currency: "VND",
  disclaimer:
    "Giá niêm yết tham khảo, đã bao gồm VAT, chưa bao gồm chi phí lăn bánh. Giá và chương trình bán hàng có thể thay đổi theo từng thời điểm – vui lòng liên hệ để nhận báo giá chính xác.",
} as const;
