import { Route, Routes } from 'react-router'
import { Layout } from '@/components/layout/Layout'
import { pageRoutes } from './routes'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {pageRoutes.map(({ path, Component }) =>
          path === '/' ? (
            <Route key={path} index element={<Component />} />
          ) : (
            <Route key={path} path={path} element={<Component />} />
          ),
        )}
      </Route>
    </Routes>
  )
}
