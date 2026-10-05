import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { Mail, MapPin, Clock, Send, MessageCircle, Copy, Check, ChevronDown } from 'lucide-react'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import SectionTag from '../components/SectionTag'
import SocialLinks from '../components/SocialLinks'
import { company, whatsappLink, mailtoLink } from '../data/company'
import { products, subcategoryLabel } from '../data/products'
import { isSupabaseConfigured } from '../lib/supabaseConfig'

const infoCards = [
  { icon: MapPin, label: 'Visit Us', value: `${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.country}`, copy: true },
  { icon: Mail, label: 'Email Us', value: company.email, href: `mailto:${company.email}`, copy: true },
  { icon: Clock, label: 'Working Hours', value: company.hours },
]

const initialForm = { name: '', company_: '', email: '', phone: '', product: '', message: '' }
const REQUIRED = ['name', 'email', 'message']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME = /^[A-Za-z][A-Za-z\s.'-]*$/

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please add your name.'
  else if (!NAME.test(form.name.trim())) errors.name = 'Please use letters only for your name.'
  if (!form.email.trim()) errors.email = 'Please add your email.'
  else if (!form.email.includes('@')) errors.email = 'Add @ to your email — e.g. you@gmail.com.'
  else if (!EMAIL.test(form.email.trim())) errors.email = 'That email address looks incomplete.'
  const digits = form.phone.replace(/\D/g, '')
  if (form.phone.trim() && digits.length < 7) errors.phone = 'Please enter a valid phone number (digits only).'
  if (!form.message.trim()) errors.message = 'Tell us a little about the order.'
  return errors
}

function buildMessage(form) {
  return [
    `Enquiry from ${form.name || 'website visitor'}${form.company_ ? ` (${form.company_})` : ''}`,
    form.email && `Email: ${form.email}`,
    form.phone && `Phone: ${form.phone}`,
    form.product && `Product interest: ${form.product}`,
    '',
    form.message || 'No additional message provided.',
  ].filter(Boolean).join('\n')
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the text is still selectable */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
      className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-ivory px-2.5 py-1 text-[11px] font-semibold text-slate hover:text-deep hover:border-gold transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="ok" className="inline-flex items-center gap-1 text-deep" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
            <Check className="w-3.5 h-3.5" /> Copied
          </motion.span>
        ) : (
          <motion.span key="copy" className="inline-flex items-center gap-1" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
            <Copy className="w-3.5 h-3.5" /> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/** Input with a floating label, a gold underline that draws from the centre, and a shake on error. */
function Field({ id, label, required, value, error, attempt, children }) {
  const reduce = useReducedMotion()
  const shake = useAnimationControls()
  const [focused, setFocused] = useState(false)
  const floated = focused || value
  // Shake once per send attempt that leaves this field in error. Keyed on `attempt` only, so
  // the error clearing (or changing) while the user types never re-triggers it.
  useEffect(() => {
    if (attempt && error && !reduce) shake.start({ x: [0, -8, 7, -5, 3, 0], transition: { duration: 0.45 } })
  }, [attempt]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div animate={shake} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
      <div className="relative">
        <label
          htmlFor={id}
          className={`absolute left-4 pointer-events-none transition-all duration-200 ${
            floated ? 'top-2 text-[10px] tracking-[0.14em] text-gold' : 'top-4 text-sm tracking-normal text-slate/80'
          } font-semibold uppercase`}
        >
          {label} {required && <span className="text-gold">*</span>}
        </label>
        {children}
        <span
          aria-hidden="true"
          className={`absolute left-3 right-3 bottom-0 h-0.5 origin-center rounded-full transition-transform duration-300 ${error ? 'bg-rust' : 'bg-gold'} ${
            focused || error ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-rust mt-1.5 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** Ring that fills as the required fields are completed — the count rolls,
    and the whole thing pops with a tick when everything is ready. */
function CompletionRing({ done, total }) {
  const R = 16
  const C = 2 * Math.PI * R
  const complete = done === total
  return (
    <motion.div
      className="flex items-center gap-3 text-xs text-slate"
      aria-live="polite"
      animate={complete ? { scale: [1, 1.07, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <span className="relative inline-flex">
        <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
          <circle cx="20" cy="20" r={R} fill="none" stroke="var(--color-line)" strokeWidth="3" />
          <motion.circle
            cx="20"
            cy="20"
            r={R}
            fill="none"
            stroke={complete ? 'var(--color-pine)' : 'var(--color-gold)'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={C}
            animate={{ strokeDashoffset: C * (1 - done / total) }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </svg>
        <AnimatePresence>
          {complete && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-pine" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {complete ? (
        <motion.span
          key="ready"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-pine"
        >
          Ready to send
        </motion.span>
      ) : (
        <span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={done}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className="inline-block font-semibold text-ink"
            >
              {done}
            </motion.span>
          </AnimatePresence>{` of ${total} required fields`}
        </span>
      )}
    </motion.div>
  )
}

/** Send button that turns into a paper plane, flies off, then shows a drawn tick. */
function SendButton({ onSend, children, className, icon: Icon, sentLabel }) {
  const reduce = useReducedMotion()
  const plane = useAnimationControls()
  const [state, setState] = useState('idle') // idle | flying | sent

  const click = (e) => {
    e.preventDefault()
    if (!onSend()) return
    // States advance on timers rather than awaiting the flight: sending opens WhatsApp or the
    // mail app, which backgrounds this tab and pauses animation frames until the visitor returns.
    if (!reduce) {
      setState('flying')
      plane.start({ x: [0, -6, 180], y: [0, 4, -90], rotate: [0, -10, -25], opacity: [1, 1, 0], transition: { duration: 0.8, times: [0, 0.2, 1], ease: 'easeIn' } })
    }
    setTimeout(() => setState('sent'), reduce ? 0 : 800)
    setTimeout(() => {
      setState('idle')
      plane.set({ x: 0, y: 0, rotate: 0, opacity: 1 })
    }, 3400)
  }

  return (
    <button type="submit" onClick={click} className={`relative overflow-visible ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'sent' ? (
          <motion.span key="sent" className="inline-flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
              <motion.path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
            </svg>
            {sentLabel}
          </motion.span>
        ) : (
          <motion.span key="idle" className="inline-flex items-center gap-2.5" exit={{ opacity: 0 }}>
            <motion.span animate={plane} className="inline-flex">
              <Icon className="w-4 h-4" />
            </motion.span>
            <span className={state === 'flying' ? 'opacity-40 transition-opacity' : ''}>{children}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/** Location pin that drops onto the map with a ripple when it scrolls into view. */
function MapPinDrop() {
  const reduce = useReducedMotion()
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full" aria-hidden="true">
      <motion.div
        initial={reduce ? false : { y: -160, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 0.4 }}
      >
        <MapPin className="w-10 h-10 text-rust drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]" fill="var(--color-ivory)" />
      </motion.div>
      {!reduce && (
        <motion.span
          className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-6 h-3 rounded-[50%] border-2 border-rust"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 3.5], opacity: [0.9, 0] }}
          viewport={{ once: true }}
          transition={{ delay: 0.75, duration: 1 }}
        />
      )}
    </div>
  )
}

/** Gold highlight for the typed part of a suggestion. */
function Hi({ name, q }) {
  if (!q) return name
  const i = name.toLowerCase().indexOf(q)
  if (i < 0) return name
  return (
    <>
      {name.slice(0, i)}
      <span className="text-gold">{name.slice(i, i + q.length)}</span>
      {name.slice(i + q.length)}
    </>
  )
}

/** Product picker in the site's own card style: type to filter, arrows + Enter work, free text kept. */
function ProductCombobox({ id, value, onType, onPick }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const q = value.trim().toLowerCase()
  const matches = products
    .filter((p) => p.status === 'active')
    .filter((p) => !q || p.name.toLowerCase().includes(q))
  const listId = `${id}-list`
  const count = Math.max(matches.length, 1)

  const pick = (name) => {
    onPick(name)
    setOpen(false)
  }

  const key = (e) => {
    if (e.key === 'ArrowDown' && !open) {
      setOpen(true)
      setHi(0)
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      setHi((h) => (h + 1) % count)
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setHi((h) => (h - 1 + count) % count)
      e.preventDefault()
    } else if (e.key === 'Enter' && open) {
      e.preventDefault()
      if (matches.length) pick(matches[hi % matches.length].name)
      else setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}>
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && matches.length ? `${listId}-${hi % matches.length}` : undefined}
        value={value}
        onChange={(e) => {
          onType(e)
          setOpen(true)
          setHi(0)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={key}
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        aria-label={open ? 'Close product list' : 'Open product list'}
        onClick={() => setOpen((o) => !o)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate hover:text-deep transition-colors"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Products"
          className="absolute left-0 right-0 top-full mt-2 z-30 max-h-60 overflow-y-auto rounded-xl border border-line/70 bg-ivory py-1.5 shadow-xl shadow-black/10"
        >
          {matches.map((p, i) => (
            <li key={p.id} id={`${listId}-${i}`} role="option" aria-selected={p.name === value}>
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault()
                  pick(p.name)
                }}
                onMouseEnter={() => setHi(i)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${i === hi % matches.length ? 'bg-sand/70' : ''}`}
              >
                <span className="text-sm font-semibold text-ink">
                  <Hi name={p.name} q={q} />
                </span>
                <span className="shrink-0 text-[11px] uppercase tracking-wide text-slate">
                  {subcategoryLabel(p.category, p.subcategory)} · {p.entry}
                </span>
              </button>
            </li>
          ))}
          {!matches.length && (
            <li className="px-4 py-3 text-sm text-slate">
              No match — keep “{value.trim()}” as a custom grade, or clear it to browse everything.
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default function Contact() {
  const [params] = useSearchParams()
  // Product pages link here with ?product=… (including any chosen broken grade).
  const [form, setForm] = useState(() => ({ ...initialForm, product: params.get('product') ?? '' }))
  const [errors, setErrors] = useState({})
  const [attempt, setAttempt] = useState(0)
  const [honeypot, setHoneypot] = useState('')

  // Name takes letters only, phone takes digits only, email stays lowercase — anything else is fixed as typed.
  const update = (key) => (e) => {
    let value = e.target.value
    if (key === 'name') value = value.replace(/[0-9]/g, '').slice(0, 80)
    if (key === 'phone') value = value.replace(/[^0-9+\-().\s]/g, '').slice(0, 24)
    if (key === 'email') value = value.toLowerCase().slice(0, 254)
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const check = () => {
    const found = validate(form)
    setErrors(found)
    setAttempt((a) => a + 1)
    return Object.keys(found).length === 0
  }

  // Every valid send is also filed in the admin inbox (when Supabase is set up), so leads are kept
  // even if the visitor never finishes sending in WhatsApp or their mail app. Bots that fill the
  // hidden "website" field are skipped. Saving runs in the background: WhatsApp has to open
  // synchronously inside the click or popup blockers stop it.
  const record = (channel) => {
    if (!isSupabaseConfigured || honeypot) return
    import('../data/remote').then(({ saveEnquiry }) => saveEnquiry(form, channel)).catch(() => {})
  }

  const sendWhatsApp = () => {
    if (!check()) return false
    record('whatsapp')
    window.open(whatsappLink(buildMessage(form)), '_blank', 'noreferrer')
    return true
  }

  const sendEmail = () => {
    if (!check()) return false
    record('email')
    window.location.href = mailtoLink(`Product Enquiry${form.product ? ` — ${form.product}` : ''}`, buildMessage(form))
    return true
  }

  const done = REQUIRED.filter((k) => (k === 'email' ? EMAIL.test(form.email.trim()) : form[k].trim())).length
  const field = (key, label, extra = {}) => ({
    id: `f-${key}`,
    label,
    value: form[key],
    error: errors[key],
    attempt,
    ...extra,
  })
  const inputProps = (key) => ({
    id: `f-${key}`,
    value: form[key],
    onChange: update(key),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `f-${key}-error` : undefined,
    className: inputClass,
  })

  return (
    <>
      <Seo
        title="Contact Us | Mahesh Rice Trading, Dubai"
        description="Get a quote for rice or pulses from Mahesh Rice Trading — Ras Al Khor Industrial, Dubai, UAE. Reach us by WhatsApp, email or the enquiry form."
        path="/contact"
      />
      <PageHero
        effect="typing"
        tag="Contact Us"
        title="Let's Talk About Your Order"
        accent="Your Order"
        body="Send your requirement through the form, WhatsApp or email — whichever is easiest for you."
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="bg-ivory py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {infoCards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative rounded-2xl p-6 border border-line/60 bg-sand/40"
              >
                {c.copy && <CopyButton value={c.value} label={c.label.replace(' Us', '')} />}
                <c.icon className="w-5.5 h-5.5 text-gold mb-4" />
                <p className="eyebrow text-slate mb-2">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-sm font-semibold text-ink hover:text-gold transition-colors break-words">{c.value}</a>
                ) : (
                  <p className="text-sm font-semibold text-ink break-words">{c.value}</p>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: infoCards.length * 0.08 }}
              className="rounded-2xl p-6 border border-line/60 bg-sand/40 flex flex-col"
            >
              <p className="eyebrow text-slate mb-4">Follow Us</p>
              <SocialLinks className="text-ink flex-1 items-center justify-between py-1 [&_a]:w-16 [&_a]:h-16" iconClassName="w-7 h-7" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
            >
              <SectionTag>Send an Enquiry</SectionTag>
              <h2 className="display-heading text-[clamp(1.8rem,3.2vw,2.6rem)] text-ink mt-5 mb-8">
                Tell Us What You <span className="display-accent text-rust">Need</span>
              </h2>

              <form className="space-y-5" noValidate onSubmit={(e) => e.preventDefault()}>
                {/* Spam trap: invisible to people, tempting to form-filling bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field {...field('name', 'Full Name', { required: true })}>
                    <input type="text" autoComplete="name" maxLength={80} {...inputProps('name')} />
                  </Field>
                  <Field {...field('company_', 'Company')}>
                    <input type="text" autoComplete="organization" {...inputProps('company_')} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field {...field('email', 'Email', { required: true })}>
                    <input type="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="email" maxLength={254} {...inputProps('email')} />
                  </Field>
                  <Field {...field('phone', 'Phone')}>
                    <input type="tel" autoComplete="tel" inputMode="tel" maxLength={24} {...inputProps('phone')} />
                  </Field>
                </div>

                <AnimatePresence>
                  {form.email && !form.email.includes('@') && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gold overflow-hidden"
                      role="status"
                    >
                      An email needs @ to work — e.g. yourname@gmail.com
                    </motion.p>
                  )}
                </AnimatePresence>

                <Field {...field('product', 'Product / Grade')}>
                  <ProductCombobox
                    id="f-product"
                    value={form.product}
                    onType={update('product')}
                    onPick={(name) => setForm((f) => ({ ...f, product: name }))}
                  />
                </Field>

                <Field {...field('message', 'Message', { required: true })}>
                  <textarea rows={5} {...inputProps('message')} className={`${inputClass} resize-none`} />
                </Field>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <SendButton
                    onSend={sendWhatsApp}
                    icon={MessageCircle}
                    sentLabel="Opened in WhatsApp"
                    className="inline-flex items-center justify-center font-semibold tracking-wide uppercase rounded-full transition-colors duration-300 px-7 py-3.5 text-sm bg-[#25D366] text-white hover:bg-[#1fb959]"
                  >
                    Message on WhatsApp
                  </SendButton>
                  <SendButton
                    onSend={sendEmail}
                    icon={Send}
                    sentLabel="Opened in your email app"
                    className="inline-flex items-center justify-center font-semibold tracking-wide uppercase rounded-full transition-colors duration-300 px-7 py-3.5 text-sm border border-ink/20 text-ink hover:border-gold hover:text-gold"
                  >
                    Send via Email
                  </SendButton>
                  <div className="sm:ml-auto">
                    <CompletionRing done={done} total={REQUIRED.length} />
                  </div>
                </div>
                <p className="text-xs text-slate pt-1">
                  By sending, you agree to our <Link to="/privacy" className="underline hover:text-gold transition-colors">Privacy Policy</Link>.
                </p>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative rounded-2xl overflow-hidden border border-line/60 h-80 lg:h-full min-h-[320px]"
            >
              <iframe
                title="Mahesh Rice Trading location"
                src={company.mapEmbedSrc}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <MapPinDrop />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

const inputClass =
  'w-full rounded-xl border border-line/70 bg-sand/30 px-4 pt-6 pb-2.5 text-sm text-ink focus:outline-none focus:border-gold/60 aria-[invalid=true]:border-rust/60 transition-colors'
