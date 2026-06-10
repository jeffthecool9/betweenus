import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MapExplorer from './pages/MapExplorer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<MapExplorer />} />
      </Routes>
    </BrowserRouter>
  )
}
