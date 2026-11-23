import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Dev: chạy hàm serverless api/*.ts (giống Vercel) ngay trong `npm run dev` */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      server.middlewares.use('/api/lead', async (req, res) => {
        const chunks: Buffer[] = []
        for await (const c of req) chunks.push(c as Buffer)
        const mod = await server.ssrLoadModule('/api/lead.ts')
        const request = new Request('http://localhost/api/lead', {
          method: req.method,
          headers: { 'Content-Type': 'application/json' },
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
        })
        const out: Response = req.method === 'POST' ? await mod.POST(request) : new Response(null, { status: 405 })
        res.statusCode = out.status
        out.headers.forEach((v, k) => res.setHeader(k, v))
        res.end(Buffer.from(await out.arrayBuffer()))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
  resolve: {
    // Root-relative: tránh nhân đôi module do khác hoa/thường ký tự ổ đĩa trên Windows (E: vs e:)
    alias: [{ find: /^@\//, replacement: '/src/' }],
  },
  ssr: {
    // Swiper chỉ phát hành ESM + CSS -> bundle cùng SSR build
    noExternal: ['swiper'],
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
})
