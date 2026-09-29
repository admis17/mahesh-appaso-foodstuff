import { useRef } from 'react'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { LAND_ROWS, MAP } from '../data/worldDots'
import { useScrub, useSlice } from './motion/useScrub'

const W = LAND_ROWS[0].length
const H = LAND_ROWS.length

// Equirectangular projection onto the dot grid (1 unit = one dot cell).
const project = ([lon, lat]) => [(lon - MAP.lon0) / MAP.step, (MAP.lat0 - lat) / MAP.step]

// Every land cell as a zero-length round-capped segment — one path instead of ~2,000 circles.
const landPath = LAND_ROWS.flatMap((row, y) =>
  [...row].map((c, x) => (c === '1' ? `M${x + 0.5} ${y + 0.5}h0` : '')),
).join('')

const HUB = project([55.3, 25.2]) // Dubai
const ORIGIN = project([77.2, 28.6]) // India

function arc(from, to, lift = 0.28) {
  const [x1, y1] = from
  const [x2, y2] = to
  const d = Math.hypot(x2 - x1, y2 - y1)
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2 - d * lift
  return `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`
}

const centred = { transformBox: 'fill-box', transformOrigin: 'center' }

/** One trade lane: draws across its slice of the map's scroll, then its marker and label land. */
function Lane({ route, index, count, progress }) {
  const to = project(route.coords)
  const start = 0.15 + (index / count) * 0.55
  const draw = useSlice(progress, [start, start + 0.25])
  const land = useSlice(progress, [start + 0.22, start + 0.3])
  const lineOpacity = useTransform(draw, [0, 0.05], [0, 1])

  return (
    <g>
      <motion.path d={arc(HUB, to)} fill="none" stroke="var(--color-gold)" strokeWidth="0.3" style={{ pathLength: draw, opacity: lineOpacity }} />
      <motion.circle cx={to[0]} cy={to[1]} r="0.65" fill="var(--color-deep)" style={{ ...centred, scale: land }} />
      <motion.text
        x={to[0]}
        y={route.mapLabel === 'below' ? to[1] + 2.4 : to[1] - 1.3}
        textAnchor="middle"
        fontSize="1.45"
        className="fill-ink font-semibold hidden sm:block"
        style={{ opacity: land }}
      >
        {route.name}
      </motion.text>
    </g>
  )
}

/**
 * Dotted world map whose trade lanes draw out of Dubai as the visitor scrolls — one region after
 * another — and rewind when scrolling back up. `routes`: [{ name, coords: [lon, lat], mapLabel? }].
 */
export default function RouteMap({ routes }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const progress = useScrub(ref, ['start 90%', 'center 40%'])
  const origin = useSlice(progress, [0, 0.15])

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Trade lanes from Dubai to ${routes.map((r) => r.name).join(', ')}, with rice and pulses sourced from India.`}
      >
        <path d={landPath} stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" className="text-deep/25" />

        {/* Origin lane: India → Dubai (faded in, since drawing it would replace its dash pattern) */}
        <motion.g style={{ opacity: origin }}>
          <path d={arc(ORIGIN, HUB, 0.35)} fill="none" stroke="var(--color-rust)" strokeWidth="0.35" strokeDasharray="0.8 0.6" />
          <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r="0.7" fill="var(--color-rust)" />
          <text x={ORIGIN[0]} y={ORIGIN[1] - 1.3} textAnchor="middle" className="fill-rust font-semibold" fontSize="1.5">
            India · origin
          </text>
        </motion.g>

        {routes.map((r, i) => (
          <Lane key={r.name} route={r} index={i} count={routes.length} progress={progress} />
        ))}

        {/* Dubai hub, gently breathing */}
        <circle cx={HUB[0]} cy={HUB[1]} r="0.9" fill="var(--color-gold)" />
        {!reduce && (
          <motion.circle
            cx={HUB[0]}
            cy={HUB[1]}
            r="0.9"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="0.25"
            style={centred}
            animate={{ scale: [1, 3.2], opacity: [0.8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <text x={HUB[0]} y={HUB[1] + 2.6} textAnchor="middle" fontSize="1.6" className="fill-deep font-bold">
          Dubai
        </text>
      </svg>
    </div>
  )
}
