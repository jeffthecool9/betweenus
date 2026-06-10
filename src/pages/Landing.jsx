import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const PlantLeft = () => (
  <svg viewBox="0 0 120 200" width="120" height="200" aria-hidden="true">
    {/* White pot */}
    <ellipse cx="60" cy="188" rx="36" ry="10" fill="#c8c8c8" />
    <path d="M28 155 Q24 188 60 188 Q96 188 92 155 Z" fill="#e8e8e8" />
    <rect x="30" y="148" width="60" height="14" rx="3" fill="#d4d4d4" />
    {/* Soil */}
    <ellipse cx="60" cy="148" rx="28" ry="7" fill="#5a3e2b" />
    {/* Stems */}
    <path d="M60 145 Q45 120 30 90 Q22 72 35 55" fill="none" stroke="#4a7c4e" strokeWidth="3" strokeLinecap="round"/>
    <path d="M60 145 Q65 115 80 88 Q90 70 82 48" fill="none" stroke="#4a7c4e" strokeWidth="3" strokeLinecap="round"/>
    <path d="M60 145 Q55 125 45 110 Q35 95 42 80" fill="none" stroke="#4a7c4e" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Leaves - large variegated */}
    <ellipse cx="28" cy="68" rx="22" ry="14" fill="#7ab87e" transform="rotate(-30,28,68)"/>
    <ellipse cx="28" cy="68" rx="10" ry="13" fill="#c8dfc9" transform="rotate(-30,28,68)"/>
    <ellipse cx="85" cy="52" rx="22" ry="13" fill="#5a9e5e" transform="rotate(20,85,52)"/>
    <ellipse cx="85" cy="52" rx="9" ry="12" fill="#b8d4ba" transform="rotate(20,85,52)"/>
    <ellipse cx="40" cy="84" rx="18" ry="11" fill="#6aae6e" transform="rotate(-15,40,84)"/>
    <ellipse cx="40" cy="84" rx="8" ry="10" fill="#bcd8be" transform="rotate(-15,40,84)"/>
    <ellipse cx="75" cy="78" rx="19" ry="11" fill="#72b876" transform="rotate(25,75,78)"/>
  </svg>
)

const PlantRight = () => (
  <svg viewBox="0 0 120 200" width="120" height="200" aria-hidden="true">
    {/* Dark pot */}
    <ellipse cx="60" cy="188" rx="36" ry="10" fill="#1a1a1a" />
    <path d="M28 155 Q24 188 60 188 Q96 188 92 155 Z" fill="#222" />
    <rect x="30" y="148" width="60" height="14" rx="3" fill="#1a1a1a" />
    <ellipse cx="60" cy="148" rx="28" ry="7" fill="#3a2a1a" />
    {/* Trailing vine stems */}
    <path d="M60 145 Q80 120 95 95 Q108 72 98 48" fill="none" stroke="#4a7c4e" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M60 145 Q40 130 25 108 Q12 88 20 65" fill="none" stroke="#4a7c4e" strokeWidth="2" strokeLinecap="round"/>
    <path d="M60 145 Q72 118 88 100 Q102 84 96 62" fill="none" stroke="#5a8c5e" strokeWidth="2" strokeLinecap="round"/>
    <path d="M60 145 Q50 125 38 104 Q28 88 32 68" fill="none" stroke="#4a7c4e" strokeWidth="2" strokeLinecap="round"/>
    {/* Trailing leaves */}
    <ellipse cx="95" cy="58" rx="16" ry="10" fill="#6db87a" transform="rotate(15,95,58)"/>
    <ellipse cx="95" cy="58" rx="6" ry="9" fill="#b8e0bf" transform="rotate(15,95,58)"/>
    <ellipse cx="22" cy="68" rx="15" ry="9" fill="#5ea86a" transform="rotate(-20,22,68)"/>
    <ellipse cx="22" cy="68" rx="5" ry="8" fill="#b0d8b8" transform="rotate(-20,22,68)"/>
    <ellipse cx="98" cy="90" rx="14" ry="8" fill="#72b87e" transform="rotate(25,98,90)"/>
    <ellipse cx="28" cy="95" rx="13" ry="8" fill="#68a874" transform="rotate(-15,28,95)"/>
    <ellipse cx="94" cy="112" rx="13" ry="8" fill="#7ac882" transform="rotate(10,94,112)"/>
  </svg>
)

const PlumFlower = () => (
  <svg viewBox="0 0 90 90" width="90" height="90" aria-hidden="true">
    {[0,72,144,216,288].map((angle, i) => (
      <ellipse
        key={i}
        cx="45" cy="22" rx="11" ry="24"
        fill={i % 2 === 0 ? '#f4a8c8' : '#f780b0'}
        opacity="0.92"
        transform={`rotate(${angle}, 45, 45)`}
      />
    ))}
    <circle cx="45" cy="45" r="10" fill="#ffe066" />
    <circle cx="45" cy="45" r="5" fill="#ff9e44" />
    {/* Dewdrops */}
    <circle cx="52" cy="38" r="2" fill="rgba(255,255,255,0.6)" />
    <circle cx="40" cy="33" r="1.5" fill="rgba(255,255,255,0.5)" />
  </svg>
)

const Pencil = () => (
  <svg viewBox="0 0 120 14" width="120" height="14" aria-hidden="true">
    <polygon points="0,0 108,0 108,14 0,14" fill="#f5c842" />
    <polygon points="0,0 0,14 108,14 108,0" fill="none" />
    <rect x="0" y="4" width="108" height="6" fill="#e8b830" opacity="0.4" />
    <polygon points="108,0 120,7 108,14" fill="#f5d5b0" />
    <rect x="96" y="0" width="14" height="14" fill="#d4a0a0" />
    <line x1="0" y1="7" x2="108" y2="7" stroke="#8B7500" strokeWidth="0.5" opacity="0.3" />
  </svg>
)

const FloatingHeart = ({ delay, x }) => (
  <motion.div
    className="absolute pointer-events-none select-none"
    style={{ left: `${x}%`, bottom: '42%', fontSize: '1rem', opacity: 0 }}
    animate={{ y: [-20, -120], opacity: [0, 0.6, 0], scale: [0.8, 1.2, 0.6] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeOut' }}
  >
    {['♡', '✦', '·', '♡'][Math.floor(x / 25)]}
  </motion.div>
)

export default function Landing() {
  const navigate = useNavigate()
  const [opening, setOpening] = useState(false)

  const handleOpen = () => {
    if (opening) return
    setOpening(true)
    setTimeout(() => navigate('/map'), 1600)
  }

  return (
    <div className="landing-scene">
      {/* Blurred garden sky backdrop */}
      <div className="garden-backdrop" />

      {/* Window */}
      <div className="window-frame">
        <div className="window-glass" />
      </div>

      {/* Table surface */}
      <div className="table-surface" />

      {/* Floating particles */}
      {[15, 30, 52, 68, 85].map((x, i) => (
        <FloatingHeart key={i} x={x} delay={i * 0.9} />
      ))}

      {/* Plants */}
      <motion.div
        className="plant plant-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <PlantLeft />
      </motion.div>
      <motion.div
        className="plant plant-right"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <PlantRight />
      </motion.div>

      {/* Title */}
      <motion.div
        className="landing-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="title-sub">our little world</p>
        <h1 className="title-main">Between Us</h1>
        <p className="title-hint">open the notebook to begin</p>
      </motion.div>

      {/* Notebook */}
      <motion.div
        className="notebook-wrapper"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="notebook"
          onClick={handleOpen}
          whileHover={{ scale: 1.03, rotateX: 32 }}
          animate={opening ? {
            scale: [1, 1.15, 8],
            opacity: [1, 1, 0],
            rotateX: [36, 20, 0],
          } : {
            rotateX: 36,
            y: [0, -4, 0],
          }}
          transition={opening ? { duration: 1.5, ease: [0.4, 0, 0.2, 1] } : {
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotateX: { duration: 0.3 },
          }}
          style={{ cursor: opening ? 'default' : 'pointer' }}
        >
          {/* Left page */}
          <div className="page page-left">
            <div className="page-lines">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="page-line" style={{ top: `${18 + i * 12}%` }} />
              ))}
            </div>
            <p className="page-text-left">Jeff & Kaylee</p>
            <p className="page-date">2024 ♡</p>
          </div>

          {/* Spine */}
          <div className="book-spine" />

          {/* Right page */}
          <div className="page page-right">
            <div className="page-lines">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="page-line" style={{ top: `${18 + i * 12}%` }} />
              ))}
            </div>

            {/* Flower positioned on right page */}
            <motion.div
              className="flower-on-page"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PlumFlower />
            </motion.div>

            {/* Pencil */}
            <div className="pencil-on-page">
              <Pencil />
            </div>
          </div>

          {/* Glow on hover */}
          <div className="notebook-glow" />
        </motion.div>
      </motion.div>

      {/* Transition flash */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="transition-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{ duration: 1.5, times: [0, 0.6, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
