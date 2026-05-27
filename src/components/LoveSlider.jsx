'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { slides } from '../data/slides'

const slideVariants = {
  enter: (dir) => ({
    y: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      y: { type: 'spring', stiffness: 280, damping: 38 },
      opacity: { duration: 0.5 },
    },
  },
  exit: (dir) => ({
    y: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: {
      y: { type: 'spring', stiffness: 280, damping: 38 },
      opacity: { duration: 0.35 },
    },
  }),
}

const textVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.55 + i * 0.18,
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

function SlideContent({ slide, index, total }) {
  const alignClass = {
    left: 'items-start text-left',
    right: 'items-end text-right',
    center: 'items-center text-center',
  }[slide.textAlign] ?? 'items-center text-center'

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 96px)' }}
    >
      {/* Gradient overlay — bottom fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            rgba(13,4,8,${slide.overlayStrength + 0.2}) 0%,
            rgba(13,4,8,${slide.overlayStrength * 0.7}) 40%,
            rgba(13,4,8,0.15) 70%,
            rgba(13,4,8,0.05) 100%
          )`,
        }}
      />
      {/* Top vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(13,4,8,0.4) 0%, transparent 25%)',
        }}
      />

      {/* Text content */}
      <div className={`relative z-10 flex flex-col gap-3 px-8 ${alignClass}`}>
        {/* Accent tag */}
        <motion.div
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2"
        >
          <span
            className="inline-block px-3 py-0.5 text-xs tracking-[0.25em] font-body"
            style={{
              color: 'rgba(228, 195, 158, 0.9)',
              border: '1px solid rgba(228, 195, 158, 0.35)',
              borderRadius: '2px',
              background: 'rgba(13,4,8,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {slide.accent}
          </span>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          custom={0.5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className={`flex ${slide.textAlign === 'center' ? 'justify-center' : slide.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className="h-px w-12"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.8), transparent)' }}
          />
        </motion.div>

        {/* Main title */}
        <motion.h1
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="font-display leading-tight"
          style={{
            fontSize: 'clamp(1.55rem, 6.5vw, 2.1rem)',
            color: '#fdf0e8',
            textShadow: '0 2px 24px rgba(0,0,0,0.6), 0 0 60px rgba(180,60,80,0.2)',
            letterSpacing: '0.06em',
          }}
        >
          {slide.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="font-body font-light"
          style={{
            fontSize: 'clamp(0.78rem, 3.2vw, 0.92rem)',
            color: 'rgba(240,210,200,0.78)',
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
            letterSpacing: '0.12em',
            lineHeight: '1.8',
            maxWidth: '28ch',
          }}
        >
          {slide.subtitle}
        </motion.p>

        {/* Progress dots */}
        <motion.div
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className={`flex gap-1.5 mt-2 ${slide.textAlign === 'center' ? 'justify-center' : slide.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}
        >
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? '20px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: i === index
                  ? 'rgba(228, 195, 158, 0.95)'
                  : 'rgba(228, 195, 158, 0.3)',
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default function LoveSlider() {
  const [[current, direction], setSlide] = useState([0, 0])
  const isDragging = useRef(false)
  const dragStartY = useRef(0)
  const lastTap = useRef(0)

  const goTo = useCallback((next) => {
    const dir = next > current ? 1 : -1
    const clamped = Math.max(0, Math.min(slides.length - 1, next))
    setSlide([clamped, dir])
  }, [current])

  const goNext = useCallback(() => {
    if (current < slides.length - 1) setSlide([current + 1, 1])
  }, [current])

  const goPrev = useCallback(() => {
    if (current > 0) setSlide([current - 1, -1])
  }, [current])

  // Touch / swipe handling
  useEffect(() => {
    const onTouchStart = (e) => {
      isDragging.current = true
      dragStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      if (!isDragging.current) return
      isDragging.current = false
      const delta = dragStartY.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 52) {
        delta > 0 ? goNext() : goPrev()
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goNext, goPrev])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  // Mouse wheel navigation (desktop)
  useEffect(() => {
    let throttle = false
    const onWheel = (e) => {
      if (throttle) return
      throttle = true
      setTimeout(() => { throttle = false }, 900)
      if (e.deltaY > 30) goNext()
      else if (e.deltaY < -30) goPrev()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goNext, goPrev])

  const slide = slides[current]

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: '#0d0408' }}
    >
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Photo background with Ken Burns */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 20, ease: 'linear' }}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                willChange: 'transform',
              }}
            />
          </div>

          {/* Slide text + overlays */}
          <SlideContent slide={slide} index={current} total={slides.length} />
        </motion.div>
      </AnimatePresence>

      {/* Side navigation arrows (desktop) */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
        {current > 0 && (
          <button
            onClick={goPrev}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(253,240,232,0.8)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 11L3 7L7 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {current < slides.length - 1 && (
          <button
            onClick={goNext}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(253,240,232,0.8)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 3L11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 7H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Slide counter top-right */}
      <div
        className="fixed top-6 right-6 z-40 font-body text-xs tracking-widest"
        style={{
          color: 'rgba(228,195,158,0.6)',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Brand mark top-left */}
      <div
        className="fixed top-6 left-6 z-40 font-display text-xs tracking-[0.3em]"
        style={{
          color: 'rgba(228,195,158,0.55)',
          paddingTop: 'env(safe-area-inset-top)',
          fontSize: '0.65rem',
        }}
      >
        只属于我们
      </div>

      {/* Swipe hint (first slide only) */}
      {current === 0 && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
              <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(228,195,158,0.4)" strokeWidth="1.2"/>
              <motion.rect
                x="8" y="5" width="2" height="6" rx="1"
                fill="rgba(228,195,158,0.7)"
                animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
          <span
            className="font-body text-center"
            style={{ color: 'rgba(228,195,158,0.45)', fontSize: '0.6rem', letterSpacing: '0.2em' }}
          >
            向上滑动
          </span>
        </motion.div>
      )}
    </div>
  )
}
