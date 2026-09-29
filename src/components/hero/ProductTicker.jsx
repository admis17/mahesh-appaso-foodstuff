import { Link } from 'react-router-dom'
import { products } from '../../data/products'

const items = products.filter((p) => p.status === 'active')

function Row({ hidden = false }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((p) => (
        <li key={p.id} className="flex items-center">
          <Link
            to={`/products/${p.category}/${p.id}`}
            tabIndex={hidden ? -1 : undefined}
            className="flex items-center gap-3 px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-ivory/70 hover:text-gold-light transition-colors whitespace-nowrap"
          >
            <span className="text-gold">{p.entry}</span>
            <span className="font-semibold text-ivory">{p.name}</span>
            <span className="normal-case tracking-normal text-ivory/55">{p.specs[0] ?? p.processing}</span>
          </Link>
          <span className="w-1 h-1 rounded-full bg-gold/60" />
        </li>
      ))}
    </ul>
  )
}

/** Endless strip of product records along the bottom of the hero; pauses on hover. */
export default function ProductTicker() {
  return (
    <nav aria-label="Product records" className="relative border-t border-ivory/10 bg-deep/80 backdrop-blur-sm overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-deep to-transparent" />
      <div className="flex animate-marquee ticker-track hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
    </nav>
  )
}
