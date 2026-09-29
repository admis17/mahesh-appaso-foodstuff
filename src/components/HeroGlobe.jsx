import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { GLOBE, GLOBE_ROWS } from '../data/globeDots'

const RAD = Math.PI / 180
const DUBAI = [55.3, 25.2]
const TILT = 18 // view from ~18°N so the Gulf sits slightly above centre

// Land dots as [lon, lat] in radians, precomputed once.
const DOTS = GLOBE_ROWS.flatMap((row, y) =>
  [...row].flatMap((c, x) => (c === '1' ? [[(GLOBE.lon0 + (x + 0.5) * GLOBE.step) * RAD, (GLOBE.lat0 - (y + 0.5) * GLOBE.step) * RAD]] : [])),
)

/** Orthographic projection; returns [x, y, depth] with depth > 0 on the visible side. */
function project([lon, lat], lon0, phi0) {
  const cosLat = Math.cos(lat)
  const dLon = lon - lon0
  const x = cosLat * Math.sin(dLon)
  const y = Math.cos(phi0) * Math.sin(lat) - Math.sin(phi0) * cosLat * Math.cos(dLon)
  const z = Math.sin(phi0) * Math.sin(lat) + Math.cos(phi0) * cosLat * Math.cos(dLon)
  return [x, y, z]
}

/**
 * Dotted globe for the Markets banner. Spins in from the Americas until Dubai faces front,
 * then keeps drifting slowly. Pauses off-screen; static (Dubai front) for reduced motion.
 */
export default function HeroGlobe({ className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const phi0 = TILT * RAD
    const target = DUBAI[0] * RAD
    let lon0 = reduce ? target : target - 200 * RAD
    let raf = 0
    let last = 0
    let visible = true
    let t0 = 0

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      canvas.width = w * dpr
      canvas.height = w * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time) => {
      const w = canvas.clientWidth
      const r = w / 2 - 6
      const c = w / 2
      ctx.clearRect(0, 0, w, w)

      // Atmosphere + sphere edge
      const glow = ctx.createRadialGradient(c, c, r * 0.6, c, c, r * 1.05)
      glow.addColorStop(0, 'rgba(217,164,65,0.05)')
      glow.addColorStop(1, 'rgba(217,164,65,0.18)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(c, c, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(233,197,120,0.35)'
      ctx.lineWidth = 1
      ctx.stroke()

      for (const d of DOTS) {
        const [x, y, z] = project(d, lon0, phi0)
        if (z <= 0) continue
        ctx.fillStyle = `rgba(251,248,241,${0.18 + z * 0.62})`
        ctx.beginPath()
        ctx.arc(c + x * r, c - y * r, 0.6 + z * 1.1, 0, Math.PI * 2)
        ctx.fill()
      }

      // Dubai marker with a pulsing ring
      const [dx, dy, dz] = project([DUBAI[0] * RAD, DUBAI[1] * RAD], lon0, phi0)
      if (dz > 0) {
        const px = c + dx * r
        const py = c - dy * r
        const pulse = reduce ? 0.5 : ((time / 1600) % 1)
        ctx.strokeStyle = `rgba(233,197,120,${0.9 * (1 - pulse)})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(px, py, 4 + pulse * 16, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = '#D9A441'
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(251,248,241,0.85)'
        ctx.font = '600 12px Inter, sans-serif'
        ctx.fillText('Dubai', px + 9, py + 4)
      }
    }

    const loop = (time) => {
      if (!t0) t0 = time
      const dt = last ? (time - last) / 1000 : 0
      last = time
      const elapsed = (time - t0) / 1000
      if (elapsed < 2.6) {
        // Ease-out spin that lands on Dubai
        const p = Math.min(1, elapsed / 2.6)
        const eased = 1 - Math.pow(1 - p, 3)
        lon0 = target - 200 * RAD * (1 - eased)
      } else {
        lon0 += 4 * RAD * dt // gentle drift afterwards
      }
      draw(time)
      if (visible) raf = requestAnimationFrame(loop)
    }

    size()
    const onResize = () => {
      size()
      draw(performance.now())
    }
    window.addEventListener('resize', onResize)

    if (reduce) {
      draw(0)
      return () => window.removeEventListener('resize', onResize)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) {
        last = 0
        raf = requestAnimationFrame(loop)
      } else cancelAnimationFrame(raf)
    })
    io.observe(canvas)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [reduce])

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Globe centred on Dubai, the hub for Mahesh Rice Trading's export routes"
      className={`aspect-square ${className}`}
    />
  )
}
