export type BodyType = 'sedan' | 'suv' | 'mpv' | 'hatchback'

export interface VehicleVersion {
  name: string
  /** Giá niêm yết (VND). `null` = chưa có giá -> hiển thị "Liên hệ". */
  price: number | null
}

export interface VehicleSpec {
  label: string
  value: string
}

export interface Vehicle {
  slug: string
  name: string
  /** Tên model, không kèm thương hiệu, ví dụ "Tucson" */
  model: string
  bodyType: BodyType
  segment: string
  tagline: string
  description: string
  /** Đoạn giới thiệu cho trang chi tiết */
  overview: string[]
  imageAlt: string
  seats: string
  highlights: VehicleSpec[]
  features: string[]
  versions: VehicleVersion[]
  featured?: boolean
  /** Trang sản phẩm chính thức để đối chiếu thông số/giá */
  sourceUrl: string
  seoKeywords?: string[]
}

export interface Promotion {
  id: string
  icon: 'tag' | 'receipt' | 'wallet' | 'gift' | 'car'
  title: string
  description: string
  /** Giá trị cụ thể – chỉ điền khi đã có chương trình thật */
  value?: string
  validUntil?: string
  appliesTo?: string[]
  /** true = dữ liệu mẫu, UI sẽ gắn nhãn "Cần cập nhật" */
  isSample: boolean
}

export type NewsCategory =
  | 'tin-tuc'
  | 'kinh-nghiem-mua-xe'
  | 'so-sanh'
  | 'huong-dan-su-dung'
  | 'kinh-nghiem-lai-xe'

export interface ArticleBlock {
  type: 'p' | 'h2' | 'ul'
  text?: string
  items?: string[]
}

export interface NewsArticle {
  slug: string
  title: string
  excerpt: string
  category: NewsCategory
  image: string // key trong image-manifest (news)
  imageAlt: string
  publishedAt: string // ISO date
  updatedAt?: string
  readingMinutes: number
  body: ArticleBlock[]
  relatedVehicles?: string[]
}

export interface ResponsiveImage {
  width: number
  height: number
  variants: { src: string; width: number; height: number }[]
}
