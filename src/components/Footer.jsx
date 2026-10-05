import { Link } from 'react-router-dom'
import { Mail, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { company } from '../data/company'
import { productCategories } from '../data/products'
import SocialLinks from './SocialLinks'

const exploreLinks = [
  { to: '/company', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/trade', label: 'Services' },
  { to: '/markets', label: 'Global Reach' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-deep text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 sm:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr] gap-12 lg:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo-sm.webp" alt="MA Foods Stuff logo" loading="lazy" decoding="async" className="h-10 w-auto shrink-0 rounded-md" />
              <span className="font-display text-xl font-semibold">MA Foods Stuff</span>
            </div>
            <p className="text-ivory/65 text-sm leading-relaxed max-w-sm mb-6">
              Dubai-based trader of rice and pulses, supplying
              wholesale buyers and distributors across the GCC, Africa, Asia, Europe and
              the Americas.
            </p>
            <p className="eyebrow text-ivory/40 mb-3">Follow Us</p>
            <SocialLinks className="text-ivory/70" />
          </div>

          <div>
            <h4 className="eyebrow text-gold-light mb-5">Explore</h4>
            <ul className="space-y-3">
              {exploreLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-ivory/75 hover:text-gold-light transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold-light mb-5">Products</h4>
            <ul className="space-y-3">
              {productCategories.map((p) => (
                <li key={p.slug}>
                  <Link to={`/products/${p.slug}`} className="text-sm text-ivory/75 hover:text-gold-light transition-colors">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold-light mb-5">Contact</h4>
            <ul className="space-y-3.5 text-sm text-ivory/75">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{company.address.line1}, {company.address.line2}, {company.address.city}, {company.address.country}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-gold" />
                <a href={`mailto:${company.email}`} className="hover:text-gold-light transition-colors">{company.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 shrink-0 text-gold" />
                <span>{company.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-gold mt-14 mb-8 opacity-40" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-ivory/55">
            © {year} {company.legalNameEn}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ivory/55">
            <Link to="/privacy" className="hover:text-gold-light transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-light transition-colors">Terms of Use</Link>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> TRN {company.trn}
            </span>
            <span>License No. {company.license.number} · {company.license.authority}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
