import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
