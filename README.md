# Hyundai Showroom – Landing page

Website đại lý ô tô Hyundai: React 19 + TypeScript, Vite, Tailwind CSS v4, Radix UI, Lucide, Swiper,
React Hook Form + Zod. Toàn bộ route được **prerender thành HTML tĩnh** (SSG) để tối ưu SEO và tốc độ tải,
sau đó hydrate thành SPA.

## Chạy dự án

Yêu cầu Node.js ≥ 20.

```bash
npm install
npm run dev        # phát triển: http://localhost:5173
npm run build      # typecheck + build client + build SSR + prerender -> dist/client
npm run preview    # xem bản build như trên hosting thật: http://localhost:4173
```

Thư mục cần deploy: **`dist/client`**.

## ⚠ Việc bắt buộc trước khi công khai website

Website cố ý **không** tự tạo thông tin doanh nghiệp, giá hay ưu đãi giả. Những mục sau đang ở trạng thái chờ cập nhật:

| Hạng mục | Vị trí | Khi chưa cập nhật |
|---|---|---|
| Domain chính thức | `.env` → `VITE_SITE_URL` | canonical, sitemap, OG dùng domain mẫu (build sẽ cảnh báo) |
| Tên, địa chỉ, hotline, email, giờ làm việc, bản đồ, Zalo/Messenger | `src/config/site.ts` → `dealer` | UI hiển thị "Đang cập nhật", ẩn nút gọi/Zalo/Messenger; **không** xuất schema AutoDealer/LocalBusiness |
| Giá xe | `src/data/vehicles.ts` + `pricing` trong `src/config/site.ts` | giá ghi "tham khảo*" và schema Product **không** có Offer |
| Chương trình khuyến mãi | `src/data/promotions.ts` | thẻ có nhãn "Cần cập nhật", không có giá trị/thời hạn cụ thể |
| API nhận form báo giá | `.env` → `VITE_LEAD_API_URL` | form báo rõ "thông tin chưa được gửi đi" (không giả lập thành công) |
| Chính sách bảo mật | `src/pages/PrivacyPage.tsx` | nội dung mẫu, cần bổ sung tên/địa chỉ đơn vị xử lý dữ liệu theo NĐ 13/2023/NĐ-CP |

### 1. Thông tin showroom

Sửa `dealer` trong [src/config/site.ts](src/config/site.ts). Khi đủ `name`, `hotline`, `address.street` và
`address.city`, structured data AutoDealer/LocalBusiness tự động được bật. `mapEmbedUrl` lấy từ
Google Maps → Chia sẻ → Nhúng bản đồ → copy giá trị `src` của iframe.

### 2. Giá xe

1. Đối chiếu giá từng phiên bản trong [src/data/vehicles.ts](src/data/vehicles.ts) với bảng giá chính thức
   của Hyundai Thành Công (link trong `sourceUrl` của từng xe). `price: null` → hiển thị "Liên hệ".
2. Sau khi đối chiếu, đặt `pricing.verified = true` và `pricing.reviewedAt = 'YYYY-MM-DD'`.
   Khi đó nhãn chuyển thành "giá niêm yết" và schema Product có Offer (giá, VND).

### 3. Khuyến mãi

Mỗi mục trong [src/data/promotions.ts](src/data/promotions.ts) có `isSample: true`. Thay nội dung bằng chương
trình thật (giá trị, thời hạn, điều kiện) rồi đặt `isSample: false` để bỏ nhãn "Cần cập nhật".

### 4. API nhận khách hàng (lead)

Form gọi `submitLead()` trong [src/services/leadService.ts](src/services/leadService.ts):

```http
POST {VITE_LEAD_API_URL}
Content-Type: application/json

{
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",          // đã chuẩn hóa, đầu số di động VN
  "vehicle": "tucson",            // slug mẫu xe
  "version": "2.0 Xăng Đặc biệt", // có thể rỗng
  "province": "Hà Nội",
  "paymentMethod": "tra-thang",   // "tra-thang" | "tra-gop"
  "source": "/san-pham/tucson",   // trang gửi form
  "submittedAt": "2026-11-12T08:00:00.000Z"
}
```

- Mọi phản hồi HTTP 2xx được coi là thành công; còn lại hiển thị lỗi kèm hotline (nếu có).
- Endpoint khác domain cần bật CORS cho domain website.
- Có trường honeypot `website` chống bot; nên bổ sung rate-limit/captcha phía server.
- Có thể thay `fetch` bằng tích hợp CRM, Google Sheets, Laravel API… mà không cần sửa UI.
- Chỉ khi chạy `npm run dev`, đặt `VITE_LEAD_MOCK=true` để thử giao diện thành công (dữ liệu không được gửi).

## Hình ảnh

```
src/assets/images/cars/<slug>/source.png   # ảnh xe PNG nền trong suốt, mỗi xe một thư mục
src/assets/images/news/*.jpg               # ảnh bài viết / lifestyle
```

```bash
npm run images   # Sharp -> public/images/**.webp (nhiều kích thước cho srcset) + image-manifest.json
npm run icons    # favicon, apple-touch-icon, icon PWA, logo.png, site.webmanifest
```

Kích thước ảnh được ghi vào `src/data/generated/image-manifest.json` để component tự khai báo
`width/height` (tránh CLS), `srcset`/`sizes`, và `loading="lazy"` cho ảnh dưới màn hình đầu.

**Bản quyền ảnh:** ảnh xe và ảnh bài viết hiện lấy từ website chính thức của Hyundai Thành Công
(hyundai-api.thanhcong.vn). Đại lý cần xác nhận quyền sử dụng theo thỏa thuận đại lý ủy quyền, hoặc thay bằng
ảnh do showroom tự chụp/được cấp phép. Logo hiện là bản SVG vẽ mô phỏng ([src/components/ui/Logo.tsx](src/components/ui/Logo.tsx)), nên thay bằng file logo trong bộ nhận diện chính thức
được Hyundai cấp cho đại lý.

## SEO

- Mỗi route được prerender HTML đầy đủ: title, meta description, canonical, Open Graph, Twitter Card, JSON-LD.
- Schema: WebSite, Organization, BreadcrumbList, Product (+Offer khi giá đã xác minh), Article,
  AutoDealer/LocalBusiness (khi có thông tin showroom), ItemList.
- `sitemap.xml` và `robots.txt` được sinh tự động khi build (`scripts/prerender.mjs`).
- Thêm route mới: khai báo trong `pageRoutes` và `prerenderPaths` ([src/routes.tsx](src/routes.tsx)).

## Deploy

Đây là site tĩnh, deploy được lên Netlify, Vercel, Cloudflare Pages, Nginx, Apache, hoặc thư mục `public`
của Laravel. Hosting cần:

1. Phục vụ `/san-pham` từ `san-pham/index.html` (đa số static host làm mặc định).
   Nginx: `try_files $uri $uri/index.html $uri.html =404;`
2. Trả `404.html` với mã 404 cho URL không tồn tại (`error_page 404 /404.html;`).
   **Không** rewrite mọi URL về `/index.html`: sai nội dung và gây lỗi hydrate.
3. Cache dài hạn cho `/assets/*` (tên file có hash): `Cache-Control: public, max-age=31536000, immutable`.

Đặt biến môi trường (`VITE_*`) **trước** khi chạy `npm run build`; giá trị được nhúng lúc build.

**Vercel:** đã có sẵn [vercel.json](vercel.json) (`outputDirectory: dist/client`). Nếu Project Settings → Build & Output
đang bật override "Output Directory" = `dist`, hãy tắt override đó (nếu không sẽ bị 404 NOT_FOUND).
Khai báo `VITE_SITE_URL`, `VITE_LEAD_API_URL` trong Settings → Environment Variables rồi Redeploy.

## Cấu trúc chính

```
src/
  config/site.ts          # thông tin showroom, trạng thái giá
  data/                   # xe, tin tức, khuyến mãi, tỉnh/thành
  services/leadService.ts # gửi form
  components/             # layout, home sections, forms, ui
  pages/                  # các trang (lazy-load theo route)
  seo/                    # quản lý <head>, JSON-LD
  entry-client.tsx        # hydrate
  entry-server.tsx        # render HTML khi prerender
scripts/                  # optimize-images, generate-icons, prerender, serve
```
