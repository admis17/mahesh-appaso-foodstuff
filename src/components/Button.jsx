import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const variants = {
  gold: 'bg-gold text-deep hover:bg-gold-light',
  deep: 'bg-deep text-ivory hover:bg-deep-light',
  outline: 'border border-ivory/30 text-ivory hover:border-gold hover:text-gold',
  'outline-dark': 'border border-ink/20 text-ink hover:border-gold hover:text-deep',
}

const sizes = {
  sm: 'px-5 py-2.5 text-xs',
  md: 'px-7 py-3 text-sm',
  lg: 'px-9 py-4 text-sm',
}

export default function Button({
  children,
  to,
  href,
  variant = 'gold',
  size = 'md',
  icon = true,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const base = `inline-flex items-center justify-center gap-2.5 font-semibold tracking-wide uppercase rounded-full transition-colors duration-300 whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`group ${base}`} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') || href.startsWith('https') ? '_blank' : undefined} rel="noreferrer" className={`group ${base}`} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={`group ${base}`} {...props}>
      {content}
    </button>
  )
}
