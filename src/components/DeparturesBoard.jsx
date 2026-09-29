import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { regions } from '../data/regions'
import SectionTag from './SectionTag'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ&·0123456789'
const COLS = [
  { key: 'dest', label: 'Destination', width: 19 },
  { key: 'via', label: 'Via', width: 5 },
  { key: 'status', label: 'Status', width: 6 },
]
const TICK = 55

const rows = regions.map((r) => ({
  dest: r.name.toUpperCase().replace(/ & /g, ' & ').padEnd(19).slice(0, 19),
  via: 'DUBAI',
  status: 'OPEN'.padEnd(6),
  countries: r.countries,
}))

// Each character settles at its own tick: rows cascade, columns sweep left to right.
const settleAt = (row, col, i) => 6 + row * 5 + col * 6 + i * 0.6

/** Split-flap board listing every market, letters flipping into place like a port departures board. */
export default function DeparturesBoard() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [tick, setTick] = useState(0)
  const done = settleAt(rows.length, COLS.length, 20) + 2

  useEffect(() => {
    if (reduce || !inView) return
    const t = setInterval(() => setTick((n) => (n >= done ? n : n + 1)), TICK)
    return () => clearInterval(t)
  }, [inView, reduce, done])

  const finished = reduce || tick >= done

  const cell = (final, row, col, i) => {
    const settled = finished || (inView && tick >= settleAt(row, col, i))
    const ch = settled || final === ' ' ? final : inView ? CHARS[(tick * 7 + row * 13 + col * 5 + i * 3) % CHARS.length] : ' '
    return (
      <span
        key={i}
        className="relative inline-flex items-center justify-center w-[0.95em] h-[1.5em] rounded-[3px] bg-[#0b2a20] text-gold-light after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/50"
      >
        <span key={ch} className={settled ? '' : 'flap'}>{ch}</span>
      </span>
    )
  }

  return (
    <section className="bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        <div className="max-w-2xl mb-10">
          <SectionTag>Departures</SectionTag>
          <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
            Six Markets, <span className="display-accent text-rust">All Open</span>
          </h2>
        </div>

        <div ref={ref} className="relative rounded-3xl bg-deep p-4 sm:p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)] overflow-x-auto">
          <table className="w-full min-w-[34rem] font-mono text-[13px] sm:text-base lg:text-lg uppercase border-separate border-spacing-y-3">
            <caption className="sr-only">Markets served, routed via Dubai, all currently open</caption>
            <thead>
              <tr className="text-left text-[10px] sm:text-xs tracking-[0.2em] text-ivory/50">
                {COLS.map((c) => (
                  <th key={c.key} className="font-semibold pr-4">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={r.dest} className="align-top">
                  {COLS.map((c, ci) => (
                    <td key={c.key} className="pr-4">
                      <span className="sr-only">{r[c.key].trim()}</span>
                      <span aria-hidden="true" className="inline-flex gap-[2px] whitespace-nowrap">
                        {[...r[c.key].padEnd(c.width).slice(0, c.width)].map((ch, i) => cell(ch, ri, ci, i))}
                      </span>
                      {c.key === 'dest' && (
                        <span className={`block mt-1.5 normal-case font-sans text-xs text-ivory/55 transition-opacity duration-700 ${finished || tick > settleAt(ri, 0, 19) ? 'opacity-100' : 'opacity-0'}`}>
                          {r.countries}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
