import ParticleCanvas from './components/ParticleCanvas'
import LoveSlider from './components/LoveSlider'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', background: '#0d0408' }}>
      <LoveSlider />
      <ParticleCanvas />
    </div>
  )
}
