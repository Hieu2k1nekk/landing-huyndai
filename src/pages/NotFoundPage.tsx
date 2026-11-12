import { ArrowLeft } from 'lucide-react'
import { Seo } from '@/seo/head'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Không tìm thấy trang"
        description="Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển."
        path="/404"
        noindex
      />
      <section className="container-page grid min-h-[70vh] place-items-center py-20 text-center">
        <div>
          <p className="text-[6rem] leading-none font-bold text-brand/10 sm:text-[9rem]">404</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Không tìm thấy trang</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy quay về trang chủ hoặc khám phá các dòng xe.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/">
              <ArrowLeft className="size-4" aria-hidden /> Về trang chủ
            </ButtonLink>
            <ButtonLink to="/san-pham" variant="outline">
              Xem dòng xe
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
