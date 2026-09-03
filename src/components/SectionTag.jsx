export default function SectionTag({ children, light = false, className = '' }) {
  return (
    <span className={`eyebrow inline-flex items-center gap-3 ${light ? 'text-gold-light' : 'text-rust'} ${className}`}>
      <span className={`h-px w-8 ${light ? 'bg-gold-light' : 'bg-rust'}`} />
      {children}
    </span>
  )
}
