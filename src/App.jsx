import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Worlds from './pages/Worlds'
import Workspace from './pages/Workspace'
import Saved from './pages/Saved'

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worlds" element={<Worlds />} />
          <Route path="/lab/:worldId" element={<Workspace />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </main>
    </>
  )
}