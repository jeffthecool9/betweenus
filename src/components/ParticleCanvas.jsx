import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 55

function createParticle(canvasWidth, canvasHeight, fromTop = true) {
  const type = Math.random() < 0.45 ? 'rose' : 'sakura'
  return {
    type,
    x: Math.random() * canvasWidth,
    y: fromTop ? -20 - Math.random() * 120 : Math.random() * canvasHeight,
    size: type === 'rose'
      ? 7 + Math.random() * 7
      : 6 + Math.random() * 6,
    speedY: 0.6 + Math.random() * 1.1,
    speedX: (Math.random() - 0.5) * 0.7,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.035,
    opacity: 0.25 + Math.random() * 0.55,
    drift: Math.random() * Math.PI * 2,
    driftSpeed: 0.008 + Math.random() * 0.012,
    driftAmplitude: 0.6 + Math.random() * 1.0,
    sway: 0,
  }
}

function drawRosePetal(ctx, size, opacity) {
  ctx.save()
  ctx.globalAlpha = opacity
  // Outer petal shape — elongated teardrop
  const gradient = ctx.createRadialGradient(0, -size * 0.3, 0, 0, 0, size)
  gradient.addColorStop(0, 'rgba(210, 90, 110, 1)')
  gradient.addColorStop(0.5, 'rgba(180, 55, 75, 0.9)')
  gradient.addColorStop(1, 'rgba(140, 30, 50, 0.3)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(0, -size)
  ctx.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.75, size * 0.2, 0, size * 0.9)
  ctx.bezierCurveTo(-size * 0.75, size * 0.2, -size * 0.7, -size * 0.6, 0, -size)
  ctx.fill()
  // Subtle vein
  ctx.strokeStyle = 'rgba(255, 160, 170, 0.25)'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(0, -size * 0.8)
  ctx.lineTo(0, size * 0.6)
  ctx.stroke()
  ctx.restore()
}

function drawSakuraPetal(ctx, size, opacity) {
  ctx.save()
  ctx.globalAlpha = opacity
  const gradient = ctx.createRadialGradient(0, -size * 0.2, 0, 0, 0, size)
  gradient.addColorStop(0, 'rgba(255, 220, 230, 1)')
  gradient.addColorStop(0.5, 'rgba(255, 190, 210, 0.85)')
  gradient.addColorStop(1, 'rgba(240, 160, 185, 0.2)')
  ctx.fillStyle = gradient
  // 5-petal cherry blossom
  for (let i = 0; i < 5; i++) {
    ctx.save()
    ctx.rotate((Math.PI * 2 * i) / 5)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      size * 0.4, -size * 0.1,
      size * 0.5, -size * 0.8,
      0, -size
    )
    ctx.bezierCurveTo(
      -size * 0.5, -size * 0.8,
      -size * 0.4, -size * 0.1,
      0, 0
    )
    ctx.fill()
    ctx.restore()
  }
  // Center dot
  ctx.fillStyle = `rgba(255, 240, 200, ${opacity * 0.9})`
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    // Seed particles spread across screen initially
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(width, height, false)
    )

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((p) => {
        // Update physics
        p.sway += p.driftSpeed
        p.x += p.speedX + Math.sin(p.sway) * p.driftAmplitude
        p.y += p.speedY
        p.rotation += p.rotationSpeed

        // Respawn when off screen
        if (p.y > height + 30 || p.x < -50 || p.x > width + 50) {
          Object.assign(p, createParticle(width, height, true))
          p.x = Math.random() * width
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        if (p.type === 'rose') {
          drawRosePetal(ctx, p.size, p.opacity)
        } else {
          drawSakuraPetal(ctx, p.size, p.opacity)
        }

        ctx.restore()
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 30 }}
    />
  )
}
