import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import JsonLd from './JsonLd'
import { siteUrl } from '../data/company'

/** items: [{ label, to }] — the last item should omit `to` (current page). */
export default function Breadcrumbs({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.to ? `${siteUrl}${item.to}` : undefined,
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-deep/95">
      <JsonLd data={schema} />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3 flex items-center flex-wrap gap-1.5 text-xs text-ivory/60">
        {items.map((item, i) => (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3 text-ivory/30" />}
            {item.to ? (
              <Link to={item.to} className="hover:text-gold-light transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-ivory/85 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}
