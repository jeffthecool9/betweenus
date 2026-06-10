import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const FloatingParticle = ({ delay, x, symbol }) => (
  <motion.div
    className="absolute pointer-events-none select-none text-rose-300/60"
    style={{ left: `${x}%`, bottom: '30%', fontSize: '0.9rem' }}
    initial={{ opacity: 0, y: 0 }}
    animate={{ y: [-10, -100], opacity: [0, 0.7, 0] }}
    transition={{ duration: 4.5, delay, repeat: Infinity, ease: 'easeOut' }}
  >
    {symbol}
  </motion.div>
)

export default function Landing() {
  const navigate = useNavigate()
  const [opening, setOpening] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleOpen = () => {
    if (opening) return
    setOpening(true)
    setTimeout(() => navigate('/map'), 1800)
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>

      {/* Hero photo — full bleed */}
      <motion.img
        src="/images/hero-desk.jpg"
        alt="Our desk"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }}
        initial={{ scale: 1.04, opacity: 0 }}
        animate={opening
          ? { scale: 2.5, opacity: 0, filter: 'brightness(3)' }
          : { scale: 1, opacity: 1 }
        }
        transition={opening
          ? { duration: 1.8, ease: [0.4, 0, 0.2, 1] }
          : { duration: 1.4, ease: 'easeOut' }
        }
      />

      {/* Top gradient for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(20,12,8,0.72) 0%, rgba(20,12,8,0.3) 35%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 100% 50% at 50% 110%, rgba(10,6,4,0.55) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Floating hearts */}
      {[
        { x: 28, delay: 0,   symbol: '♡' },
        { x: 45, delay: 1.4, symbol: '✦' },
        { x: 62, delay: 2.8, symbol: '♡' },
        { x: 72, delay: 0.7, symbol: '·' },
      ].map((p, i) => <FloatingParticle key={i} {...p} />)}

      {/* Title block */}
      <motion.div
        style={{ position: 'absolute', top: 'clamp(24px, 6vh, 56px)', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10, pointerEvents: 'none', whiteSpace: 'nowrap' }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(0.8rem, 2.5vw, 1.05rem)', color: 'rgba(255,240,220,0.6)', letterSpacing: '0.18em', marginBottom: '4px' }}>
          our little world
        </p>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2rem, 7vw, 3.6rem)', color: '#fff8f0', textShadow: '0 2px 24px rgba(200,140,80,0.5), 0 0 60px rgba(0,0,0,0.4)', lineHeight: 1 }}>
          Between Us
        </h1>
        <motion.p
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)', color: 'rgba(255,240,220,0.45)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '8px' }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          click the notebook to begin
        </motion.p>
      </motion.div>

      {/* Invisible notebook click zone — positioned over the book in the photo */}
      {/* Book sits center-left, bottom 10–50% of image */}
      <motion.div
        onClick={handleOpen}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          position: 'absolute',
          left: '28%',
          right: '28%',
          bottom: '8%',
          top: '52%',
          cursor: opening ? 'default' : 'pointer',
          zIndex: 20,
          borderRadius: '8px',
        }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Subtle glow ring on hover */}
        <AnimatePresence>
          {hovered && !opening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: '-12px',
                borderRadius: '14px',
                border: '1.5px solid rgba(245,200,100,0.45)',
                boxShadow: '0 0 30px rgba(245,200,100,0.2), inset 0 0 20px rgba(245,200,100,0.08)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* Hover label */}
        <AnimatePresence>
          {hovered && !opening && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              style={{
                position: 'absolute', bottom: '-36px', left: '50%', transform: 'translateX(-50%)',
                fontFamily: "'Dancing Script', cursive", fontSize: '1rem',
                color: 'rgba(245,220,150,0.9)', whiteSpace: 'nowrap',
                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                pointerEvents: 'none',
              }}
            >
              Open our notebook ♡
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* White flash on open */}
      <AnimatePresence>
        {opening && (
          <motion.div
            style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 1000, pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{ duration: 1.8, times: [0, 0.55, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
