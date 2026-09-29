import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, RefreshCw } from 'lucide-react'
import Scramble from './motion/Scramble'
import useMediaQuery, { FINE_POINTER } from './motion/useMediaQuery'
import { ON_ENQUIRY } from '../data/products'

/**
 * Category product card. Front: number, entry, name. Back: the spec sheet.
 * Hover or keyboard focus turns it on desktop; tap toggles on touch screens.
 * Both faces share one grid cell, so the card is as tall as the taller face.
 */
export default function FlipCard({ product: p, type, number, href }) {
  const reduce = useReducedMotion()
  const fine = useMediaQuery(FINE_POINTER)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [tapped, setTapped] = useState(false)
  const flipped = fine ? hovered || focused : tapped || focused

  const face = 'col-start-1 row-start-1 rounded-2xl border p-7 [backface-visibility:hidden]'

  return (
    <div
      className="[perspective:1200px] h-full"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      <motion.div
        className="grid h-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 20 }}
      >
        {/* Front */}
        <div
          className={`${face} border-line/60 bg-sand/30 flex flex-col cursor-pointer`}
          onClick={() => !fine && setTapped((t) => !t)}
        >
          <div className="flex items-center justify-between mb-10">
            <span className="font-display text-4xl text-gold/50">{String(number).padStart(3, '0')}</span>
            <Scramble text={p.entry} delay={0.1 + number * 0.05} className="eyebrow px-3 py-1 rounded-full bg-deep text-gold-light" />
          </div>
          <h3 className="font-display text-3xl font-semibold text-ink mb-2">{p.name}</h3>
          <p className="text-xs uppercase tracking-wide text-slate">
            {type} · {p.origin} · {p.processing}
          </p>
          <span className="mt-auto pt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate">
            <RefreshCw className="w-3.5 h-3.5" /> {fine ? 'Hover for specs' : 'Tap for specs'}
          </span>
        </div>

        {/* Back */}
        <div
          className={`${face} border-gold/50 bg-deep text-ivory [transform:rotateY(180deg)] flex flex-col`}
          onClick={(e) => !fine && !e.target.closest('a') && setTapped(false)}
        >
          <p className="eyebrow text-gold-light mb-1">{p.entry}</p>
          <p className="font-display text-xl font-semibold mb-5">{p.name}</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
            {[
              ['Origin', p.origin],
              ['Process', p.processing],
              ['Type', type],
              ['Spec', p.specs[0] ?? ON_ENQUIRY],
            ].map(([k, v]) => (
              <div key={k} className={`border-t border-ivory/15 pt-2 ${k === 'Spec' ? 'col-span-2' : ''}`}>
                <dt className="text-[11px] uppercase tracking-wide text-ivory/55">{k}</dt>
                <dd className="text-sm font-semibold first-letter:uppercase">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            to={href}
            className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-light hover:text-gold transition-colors"
          >
            View Record <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
