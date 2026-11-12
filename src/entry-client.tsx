import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, matchRoutes } from 'react-router'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/vietnamese-600.css'
import '@fontsource/be-vietnam-pro/vietnamese-700.css'
import '@fontsource/be-vietnam-pro/latin-400.css'
import '@fontsource/be-vietnam-pro/latin-600.css'
import '@fontsource/be-vietnam-pro/latin-700.css'
import './styles/globals.css'
import { App } from './App'
import { HeadProvider } from './seo/head'
import { pageRoutes } from './routes'

const root = document.getElementById('root')!

const app = (
  <StrictMode>
    <HeadProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
)

async function start() {
  if (root.firstElementChild) {
    // HTML đã prerender: nạp trước chunk của route hiện tại rồi hydrate (tránh nháy fallback)
    const match = matchRoutes(
      pageRoutes.map((r) => ({ path: r.path })),
      window.location.pathname,
    )?.[0]
    const route = pageRoutes.find((r) => r.path === match?.route.path)
    await route?.load?.()
    hydrateRoot(root, app)
  } else {
    createRoot(root).render(app)
  }
}

start()
