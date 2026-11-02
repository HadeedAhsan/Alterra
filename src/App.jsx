import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Worlds from './pages/Worlds'
import Workspace from './pages/Workspace'
import Saved from './pages/Saved'
import NotFound from './pages/NotFound'

// Sets the tab title on every route and moves focus to the page heading
// after navigation, so screen readers announce the new page.
function useRouteAnnouncement() {
  const { pathname } = useLocation()
  const lastPath = useRef(pathname)

  useEffect(() => {
    const heading = document.querySelector('main h1')
    document.title =
      pathname === '/' || !heading ? 'Alterra' : `${heading.textContent} · Alterra`

    if (lastPath.current === pathname) return
    lastPath.current = pathname
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }, [pathname])
}

export default function App() {
  useRouteAnnouncement()

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worlds" element={<Worlds />} />
          <Route path="/lab/:worldId" element={<Workspace />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}