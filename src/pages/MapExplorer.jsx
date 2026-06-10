import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMemories } from '../hooks/useMemories'
import MemoryModal from '../components/MemoryModal'

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// KL / Selangor preset locations
const LOCATIONS = [
  { id: 'klcc', name: 'Petronas Twin Towers', tag: '🏙️ KLCC', lat: 3.1578, lng: 101.7123 },
  { id: 'bbintang', name: 'Bukit Bintang', tag: '✨ Shopping', lat: 3.1452, lng: 101.7128 },
  { id: 'bangsar', name: 'Bangsar', tag: '🍜 Food', lat: 3.1298, lng: 101.6754 },
  { id: 'petaling', name: 'Petaling Street', tag: '🏮 Chinatown', lat: 3.1469, lng: 101.6934 },
  { id: 'kltower', name: 'KL Tower', tag: '📡 Landmark', lat: 3.1527, lng: 101.7038 },
  { id: 'dataran', name: 'Dataran Merdeka', tag: '🇲🇾 History', lat: 3.1489, lng: 101.6936 },
  { id: 'pavilion', name: 'Pavilion KL', tag: '🛍️ Shopping', lat: 3.1490, lng: 101.7134 },
  { id: 'klccpark', name: 'KLCC Park', tag: '🌳 Nature', lat: 3.1536, lng: 101.7114 },
]

// Character walk paths (around KLCC/Golden Triangle area)
const CHAR_PATHS = {
  jeff:   [[3.1578,101.7123],[3.1595,101.7145],[3.1610,101.7130],[3.1595,101.7110],[3.1578,101.7123]],
  kaylee: [[3.1540,101.7100],[3.1555,101.7120],[3.1545,101.7140],[3.1528,101.7118],[3.1540,101.7100]],
  breezy: [[3.1500,101.7150],[3.1515,101.7165],[3.1530,101.7155],[3.1515,101.7140],[3.1500,101.7150]],
  elsa:   [[3.1560,101.7080],[3.1575,101.7095],[3.1565,101.7115],[3.1550,101.7098],[3.1560,101.7080]],
}

function lerp(a, b, t) { return a + (b - a) * t }

// SVG character components
const JeffSVG = ({ flipped }) => (
  <svg viewBox="0 0 44 70" width="44" height="70" style={{ transform: flipped ? 'scaleX(-1)' : 'none', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }}>
    {/* Hair */}
    <ellipse cx="22" cy="11" rx="13" ry="9" fill="#8B6914"/>
    <ellipse cx="10" cy="16" rx="4" ry="5" fill="#7a5c10"/>
    <ellipse cx="34" cy="14" rx="3" ry="4" fill="#7a5c10"/>
    {/* Head */}
    <ellipse cx="22" cy="17" rx="11" ry="12" fill="#FDDCB0"/>
    {/* Glasses */}
    <rect x="12" y="15" width="7" height="5" rx="2" fill="none" stroke="#333" strokeWidth="1.2"/>
    <rect x="25" y="15" width="7" height="5" rx="2" fill="none" stroke="#333" strokeWidth="1.2"/>
    <line x1="19" y1="17" x2="25" y2="17" stroke="#333" strokeWidth="1.2"/>
    {/* Eyes */}
    <circle cx="15.5" cy="17" r="1.5" fill="#333"/>
    <circle cx="28.5" cy="17" r="1.5" fill="#333"/>
    {/* Smile */}
    <path d="M18 22 Q22 25 26 22" fill="none" stroke="#c88060" strokeWidth="1"/>
    {/* Body - white shirt */}
    <rect x="13" y="28" width="18" height="20" rx="4" fill="#F0F0F0"/>
    {/* Bag strap */}
    <path d="M16 28 Q12 36 14 44" fill="none" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="10" y="40" width="7" height="5" rx="2" fill="#a07820"/>
    {/* Arms */}
    <rect x="6" y="28" width="7" height="14" rx="3.5" fill="#FDDCB0" className="char-arm-l"/>
    <rect x="31" y="28" width="7" height="14" rx="3.5" fill="#FDDCB0" className="char-arm-r"/>
    {/* Pants */}
    <rect x="13" y="46" width="8" height="16" rx="3" fill="#222" className="char-leg-l"/>
    <rect x="23" y="46" width="8" height="16" rx="3" fill="#222" className="char-leg-r"/>
    {/* Shoes */}
    <ellipse cx="17" cy="64" rx="6" ry="3" fill="#eee"/>
    <ellipse cx="27" cy="64" rx="6" ry="3" fill="#eee"/>
  </svg>
)

const KayleeSVG = ({ flipped }) => (
  <svg viewBox="0 0 44 72" width="44" height="72" style={{ transform: flipped ? 'scaleX(-1)' : 'none', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }}>
    {/* Long black hair back */}
    <rect x="8" y="10" width="10" height="40" rx="5" fill="#1a1a1a"/>
    <rect x="26" y="10" width="10" height="42" rx="5" fill="#1a1a1a"/>
    {/* Head */}
    <ellipse cx="22" cy="17" rx="11" ry="12" fill="#FDDCB0"/>
    {/* Hair top */}
    <ellipse cx="22" cy="9" rx="12" ry="7" fill="#1a1a1a"/>
    {/* Eyes */}
    <circle cx="17" cy="16" r="2.2" fill="#333"/>
    <circle cx="27" cy="16" r="2.2" fill="#333"/>
    <circle cx="17.8" cy="15.2" r="0.8" fill="white"/>
    <circle cx="27.8" cy="15.2" r="0.8" fill="white"/>
    {/* Smile */}
    <path d="M18 22 Q22 25.5 26 22" fill="none" stroke="#c88060" strokeWidth="1.2"/>
    {/* Body - black crop top */}
    <rect x="13" y="28" width="18" height="14" rx="4" fill="#1a1a1a"/>
    {/* Small bag */}
    <rect x="30" y="32" width="6" height="5" rx="2" fill="#6b4f3a"/>
    {/* Arms */}
    <rect x="6" y="28" width="7" height="13" rx="3.5" fill="#FDDCB0" className="char-arm-l"/>
    <rect x="31" y="28" width="7" height="13" rx="3.5" fill="#FDDCB0" className="char-arm-r"/>
    {/* Jeans */}
    <rect x="13" y="40" width="8" height="22" rx="3" fill="#4a6fa5" className="char-leg-l"/>
    <rect x="23" y="40" width="8" height="22" rx="3" fill="#4a6fa5" className="char-leg-r"/>
    {/* Shoes */}
    <ellipse cx="17" cy="64" rx="6" ry="3" fill="#eee"/>
    <ellipse cx="27" cy="64" rx="6" ry="3" fill="#eee"/>
  </svg>
)

const BreezySVG = ({ flipped }) => (
  <svg viewBox="0 0 56 56" width="56" height="56" style={{ transform: flipped ? 'scaleX(-1)' : 'none', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}>
    {/* Fluffy body */}
    <ellipse cx="28" cy="36" rx="18" ry="16" fill="#111"/>
    {/* Fluffy texture */}
    {[[-8,6],[8,4],[-12,-2],[12,-4],[-6,-8],[6,-6]].map(([dx,dy],i)=>(
      <ellipse key={i} cx={28+dx} cy={36+dy} rx="5" ry="4" fill="#1a1a1a" opacity="0.8"/>
    ))}
    {/* Head */}
    <ellipse cx="28" cy="18" rx="14" ry="13" fill="#111"/>
    {/* Ears */}
    <polygon points="14,8 10,0 20,6" fill="#0a0a0a"/>
    <polygon points="42,8 46,0 36,6" fill="#0a0a0a"/>
    <polygon points="15,7 12,2 19,6" fill="#2a0a0a"/>
    <polygon points="41,7 44,2 37,6" fill="#2a0a0a"/>
    {/* Big yellow eyes */}
    <ellipse cx="21" cy="17" rx="5" ry="5.5" fill="#f5c842"/>
    <ellipse cx="35" cy="17" rx="5" ry="5.5" fill="#f5c842"/>
    <ellipse cx="21" cy="17" rx="2" ry="4" fill="#111"/>
    <ellipse cx="35" cy="17" rx="2" ry="4" fill="#111"/>
    <circle cx="22.5" cy="15" r="1.5" fill="white"/>
    <circle cx="36.5" cy="15" r="1.5" fill="white"/>
    {/* Moon collar charm */}
    <circle cx="28" cy="30" r="4" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
    <text x="25.5" y="33" fontSize="5" fill="#f5c842">☽</text>
    {/* Tail */}
    <path d="M46 38 Q58 30 54 20 Q52 14 48 18" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round" className="cat-tail"/>
    {/* Legs */}
    <ellipse cx="18" cy="50" rx="6" ry="5" fill="#0d0d0d" className="char-leg-l"/>
    <ellipse cx="38" cy="50" rx="6" ry="5" fill="#0d0d0d" className="char-leg-r"/>
  </svg>
)

const ElsaSVG = ({ flipped }) => (
  <svg viewBox="0 0 56 56" width="56" height="56" style={{ transform: flipped ? 'scaleX(-1)' : 'none', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }}>
    {/* Body white */}
    <ellipse cx="28" cy="36" rx="18" ry="16" fill="#f8f4ee"/>
    {/* Calico patches */}
    <ellipse cx="22" cy="32" rx="7" ry="6" fill="#e8a070" opacity="0.7"/>
    <ellipse cx="36" cy="40" rx="6" ry="5" fill="#2a1a0a" opacity="0.5"/>
    {/* Head */}
    <ellipse cx="28" cy="18" rx="14" ry="13" fill="#f8f4ee"/>
    {/* Head patch */}
    <ellipse cx="20" cy="14" rx="6" ry="5" fill="#e8a070" opacity="0.6"/>
    {/* Ears */}
    <polygon points="14,8 10,0 20,6" fill="#f8d8c8"/>
    <polygon points="42,8 46,0 36,6" fill="#f8d8c8"/>
    <polygon points="15,7 12,2 19,6" fill="#f0a090"/>
    <polygon points="41,7 44,2 37,6" fill="#f0a090"/>
    {/* Blue eyes */}
    <ellipse cx="21" cy="17" rx="4.5" ry="5" fill="#4a9fd4"/>
    <ellipse cx="35" cy="17" rx="4.5" ry="5" fill="#4a9fd4"/>
    <ellipse cx="21" cy="17" rx="1.8" ry="3.5" fill="#111"/>
    <ellipse cx="35" cy="17" rx="1.8" ry="3.5" fill="#111"/>
    <circle cx="22.5" cy="15" r="1.5" fill="white"/>
    <circle cx="36.5" cy="15" r="1.5" fill="white"/>
    {/* Bell collar */}
    <circle cx="28" cy="30" r="4" fill="none" stroke="#f5c842" strokeWidth="1.5"/>
    <circle cx="28" cy="33" r="2" fill="#f5c842"/>
    {/* Tail */}
    <path d="M46 38 Q58 30 54 20 Q52 14 48 18" fill="none" stroke="#f8f4ee" strokeWidth="5" strokeLinecap="round" className="cat-tail"/>
    {/* Legs */}
    <ellipse cx="18" cy="50" rx="6" ry="5" fill="#f0ece4" className="char-leg-l"/>
    <ellipse cx="38" cy="50" rx="6" ry="5" fill="#f0ece4" className="char-leg-r"/>
  </svg>
)

const CHARS = [
  { id: 'jeff',   label: 'Jeff',   Svg: JeffSVG,   color: '#f5c842' },
  { id: 'kaylee', label: 'Kaylee', Svg: KayleeSVG, color: '#f780b0' },
  { id: 'breezy', label: 'Breezy', Svg: BreezySVG, color: '#a855f7' },
  { id: 'elsa',   label: 'Elsa',   Svg: ElsaSVG,   color: '#38bdf8' },
]

// Component to track map pixel coords for character rendering
function MapBridge({ onReady }) {
  const map = useMap()
  useEffect(() => { onReady(map) }, [map, onReady])
  return null
}

// Click anywhere on map to add custom memory
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng) } })
  return null
}

// ── Intro animation overlay ──────────────────────────────────────────────────
function IntroOverlay({ onDone }) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800)
    const t2 = setTimeout(() => setStage(2), 2200)
    const t3 = setTimeout(() => setStage(3), 3400)
    const t4 = setTimeout(onDone, 4200)
    return () => [t1,t2,t3,t4].forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      className="intro-overlay"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      {/* Globe SVG */}
      <motion.div
        className="intro-globe"
        animate={stage >= 2 ? { scale: 12, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.4,0,0.2,1] }}
      >
        <svg viewBox="0 0 200 200" width="220" height="220">
          {/* Globe outline */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="90" fill="rgba(14,100,150,0.12)"/>
          {/* Latitude lines */}
          {[30,60,90,120,150].map(y => (
            <line key={y} x1="10" y1={y} x2="190" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
          ))}
          {/* Longitude lines */}
          {[40,70,100,130,160].map(x => (
            <line key={x} x1={x} y1="10" x2={x} y2="190" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
          ))}
          {/* Simple continent shapes */}
          {/* Asia approximate */}
          <path d="M110 50 Q130 45 145 55 Q160 65 155 80 Q150 95 140 100 Q125 108 115 100 Q105 92 108 75 Z" fill="rgba(100,200,120,0.3)" stroke="rgba(100,200,120,0.5)" strokeWidth="0.8"/>
          {/* Malaysia glow dot */}
          <motion.circle
            cx="128" cy="90" r={stage >= 1 ? 5 : 2}
            fill="#f780b0"
            animate={{ r: [3, 7, 3], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.circle cx="128" cy="90" r="12" fill="none" stroke="#f780b0" strokeWidth="0.8"
            animate={{ r: [8, 18], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Text stages */}
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.p key="t0" className="intro-text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            Finding our world...
          </motion.p>
        )}
        {stage === 1 && (
          <motion.p key="t1" className="intro-text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            ♡ Found you in Kuala Lumpur
          </motion.p>
        )}
        {stage >= 2 && (
          <motion.p key="t2" className="intro-text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            Zooming in...
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function MapExplorer() {
  const navigate = useNavigate()
  const { memories, addMemory, getByLocation } = useMemories()
  const [showIntro, setShowIntro] = useState(true)
  const [selectedLoc, setSelectedLoc] = useState(null)
  const mapRef = useRef(null)
  const [charPixels, setCharPixels] = useState({})
  const [charState, setCharState] = useState(() =>
    Object.fromEntries(Object.entries(CHAR_PATHS).map(([id, path]) => [id, { pathIdx: 0, t: 0, flipped: false }]))
  )

  const handleMapReady = useCallback((map) => { mapRef.current = map }, [])

  // Walk characters along paths
  useEffect(() => {
    const interval = setInterval(() => {
      setCharState(prev => {
        const next = { ...prev }
        Object.entries(CHAR_PATHS).forEach(([id, path]) => {
          const s = { ...prev[id] }
          s.t += 0.008
          if (s.t >= 1) {
            s.t = 0
            s.pathIdx = (s.pathIdx + 1) % path.length
          }
          const from = path[s.pathIdx]
          const to = path[(s.pathIdx + 1) % path.length]
          s.flipped = to[1] < from[1]
          next[id] = s
        })
        return next
      })

      // Update pixel positions
      if (mapRef.current) {
        const pixels = {}
        Object.entries(CHAR_PATHS).forEach(([id, path]) => {
          setCharState(cs => {
            const s = cs[id]
            if (!s) return cs
            const from = path[s.pathIdx]
            const to = path[(s.pathIdx + 1) % path.length]
            const lat = lerp(from[0], to[0], s.t)
            const lng = lerp(from[1], to[1], s.t)
            try {
              const pt = mapRef.current.latLngToContainerPoint([lat, lng])
              pixels[id] = { x: pt.x, y: pt.y, flipped: s.flipped }
            } catch {}
            return cs
          })
        })
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Separate effect to update pixels after charState changes
  useEffect(() => {
    if (!mapRef.current) return
    const pixels = {}
    Object.entries(CHAR_PATHS).forEach(([id, path]) => {
      const s = charState[id]
      if (!s) return
      const from = path[s.pathIdx]
      const to = path[(s.pathIdx + 1) % path.length]
      const lat = lerp(from[0], to[0], s.t)
      const lng = lerp(from[1], to[1], s.t)
      try {
        const pt = mapRef.current.latLngToContainerPoint([lat, lng])
        pixels[id] = { x: pt.x, y: pt.y, flipped: s.flipped }
      } catch {}
    })
    setCharPixels(pixels)
  }, [charState])

  const handleLocationClick = (loc) => setSelectedLoc(loc)
  const handleMapClick = (latlng) => {
    setSelectedLoc({
      id: `custom_${Date.now()}`,
      name: 'Custom Spot',
      tag: '📍 Your Place',
      lat: latlng.lat,
      lng: latlng.lng,
    })
  }

  const memCountByLoc = (locId) => memories.filter(m => m.locationId === locId).length

  const pinIcon = (loc) => L.divIcon({
    className: '',
    html: `<div class="map-pin" data-count="${memCountByLoc(loc.id)}">
      <div class="pin-dot"></div>
      ${memCountByLoc(loc.id) > 0 ? `<div class="pin-count">${memCountByLoc(loc.id)}</div>` : ''}
    </div>`,
    iconSize: [30, 36],
    iconAnchor: [15, 36],
  })

  return (
    <div className="map-explorer">
      {/* Back button */}
      <button className="map-back-btn" onClick={() => navigate('/')}>
        ← Our Notebook
      </button>

      {/* Character legend */}
      <div className="char-legend">
        {CHARS.map(c => (
          <div key={c.id} className="legend-item">
            <span className="legend-dot" style={{ background: c.color }} />
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Memory count badge */}
      {memories.length > 0 && (
        <div className="memories-badge">
          ♡ {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
        </div>
      )}

      {/* Leaflet map */}
      <MapContainer
        center={[3.1578, 101.7123]}
        zoom={14}
        style={{ width: '100vw', height: '100dvh', position: 'absolute', inset: 0 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapBridge onReady={handleMapReady} />
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Location pins */}
        {LOCATIONS.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={pinIcon(loc)}
            eventHandlers={{ click: () => handleLocationClick(loc) }}
          >
            <Popup className="loc-popup">
              <strong>{loc.name}</strong>
              <br />
              <small>{memCountByLoc(loc.id)} memories stored</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Characters rendered as absolute positioned React elements */}
      <div className="characters-layer" aria-hidden="true">
        {CHARS.map(c => {
          const pos = charPixels[c.id]
          if (!pos) return null
          return (
            <div
              key={c.id}
              className="character-on-map"
              style={{ left: pos.x, top: pos.y }}
            >
              <c.Svg flipped={pos.flipped} />
              <div className="char-name-tag" style={{ color: c.color }}>{c.label}</div>
            </div>
          )
        })}
      </div>

      {/* Memory modal */}
      <AnimatePresence>
        {selectedLoc && (
          <MemoryModal
            location={selectedLoc}
            memories={getByLocation(selectedLoc.id)}
            onAdd={addMemory}
            onClose={() => setSelectedLoc(null)}
          />
        )}
      </AnimatePresence>

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay key="intro" onDone={() => setShowIntro(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
