import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { statusStyles } from './adminUtils'

// Small, plain building blocks for the admin screens — styled with the site's palette.

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
        {description && <p className="text-sm text-slate mt-1.5 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-2xl border border-line/70 bg-ivory ${className}`}>{children}</div>
}

const buttonStyles = {
  primary: 'bg-deep text-ivory hover:bg-deep-light',
  gold: 'bg-gold text-deep hover:bg-gold-light',
  outline: 'border border-line text-ink hover:border-deep',
  danger: 'border border-rust/40 text-rust hover:bg-rust hover:text-ivory',
  ghost: 'text-slate hover:text-ink hover:bg-sand',
}

export function Btn({ variant = 'primary', busy = false, className = '', children, ...props }) {
  return (
    <button
      type="button"
      disabled={busy || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyles[variant]} ${className}`}
      {...props}
    >
      {busy && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

/** Delete-style button that asks for a second click to confirm. */
export function ConfirmBtn({ onConfirm, children, confirmLabel = 'Click again to confirm', ...props }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 3500)
    return () => clearTimeout(t)
  }, [armed])
  return (
    <Btn
      variant="danger"
      {...props}
      onClick={() => {
        if (armed) {
          setArmed(false)
          onConfirm()
        } else setArmed(true)
      }}
    >
      {armed ? confirmLabel : children}
    </Btn>
  )
}

export function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate mb-1.5">{label}</span>
      {children}
      {hint && !error && <span className="block text-xs text-slate/80 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-rust mt-1">{error}</span>}
    </label>
  )
}

export function Badge({ tone, children }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[tone] ?? 'bg-sand text-ink'}`}>{children}</span>
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate py-10 justify-center">
      <Loader2 className="w-4 h-4 animate-spin" /> {label}
    </div>
  )
}

export function ErrorNote({ error }) {
  if (!error) return null
  return <p className="rounded-lg bg-rust/10 border border-rust/30 text-rust text-sm px-4 py-3 mb-6">{error}</p>
}

