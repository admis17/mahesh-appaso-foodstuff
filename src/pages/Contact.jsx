import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import SectionTag from '../components/SectionTag'
import SocialLinks from '../components/SocialLinks'
import { company, whatsappLink, mailtoLink } from '../data/company'

const infoCards = [
  { icon: MapPin, label: 'Visit Us', value: `${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.country}` },
  { icon: Mail, label: 'Email Us', value: company.email, href: `mailto:${company.email}` },
  { icon: Clock, label: 'Working Hours', value: company.hours },
]

const initialForm = { name: '', company_: '', email: '', phone: '', product: '', message: '' }

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

export default function Contact() {
  const [form, setForm] = useState(initialForm)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const sendWhatsApp = (e) => {
    e.preventDefault()
    window.open(whatsappLink(buildMessage(form)), '_blank', 'noreferrer')
  }

  const sendEmail = (e) => {
    e.preventDefault()
    window.location.href = mailtoLink(
      `Rice Enquiry${form.product ? ` — ${form.product}` : ''}`,
      buildMessage(form)
    )
  }

  return (
    <>
      <Seo
        title="Contact Us | Mahesh Rice Trading, Dubai"
        description="Get a quote for Basmati or Non-Basmati rice from Mahesh Rice Trading — Ras Al Khor Industrial, Dubai, UAE. Reach us by WhatsApp, email or the enquiry form."
        path="/contact"
      />
      <PageHero
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
                className="rounded-2xl p-6 border border-line/60 bg-sand/40"
              >
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
              className="rounded-2xl p-6 border border-line/60 bg-sand/40"
            >
              <p className="eyebrow text-slate mb-4">Follow Us</p>
              <SocialLinks className="text-ink" />
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

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <input required type="text" value={form.name} onChange={update('name')} placeholder="Your name" className={inputClass} />
                  </Field>
                  <Field label="Company">
                    <input type="text" value={form.company_} onChange={update('company_')} placeholder="Company name" className={inputClass} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Email" required>
                    <input required type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" className={inputClass} />
                  </Field>
                  <Field label="Phone">
                    <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+00 000 000 0000" className={inputClass} />
                  </Field>
                </div>

                <Field label="Rice Grade">
                  <input type="text" value={form.product} onChange={update('product')} placeholder="e.g. 1121 Basmati, 20 MT" className={inputClass} />
                </Field>

                <Field label="Message" required>
                  <textarea required rows={5} value={form.message} onChange={update('message')} placeholder="Tell us the quantity, destination port and timeline..." className={`${inputClass} resize-none`} />
                </Field>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="submit"
                    onClick={sendWhatsApp}
                    className="group inline-flex items-center justify-center gap-2.5 font-semibold tracking-wide uppercase rounded-full transition-colors duration-300 px-7 py-3.5 text-sm bg-[#25D366] text-white hover:bg-[#1fb959]"
                  >
                    <MessageCircle className="w-4 h-4" /> Message on WhatsApp
                  </button>
                  <button
                    type="submit"
                    onClick={sendEmail}
                    className="group inline-flex items-center justify-center gap-2.5 font-semibold tracking-wide uppercase rounded-full transition-colors duration-300 px-7 py-3.5 text-sm border border-ink/20 text-ink hover:border-gold hover:text-gold"
                  >
                    <Send className="w-4 h-4" /> Send via Email
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="rounded-2xl overflow-hidden border border-line/60 h-80 lg:h-full min-h-[320px]"
            >
              <iframe
                title="Mahesh Rice Trading location"
                src={company.mapEmbedSrc}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

const inputClass =
  'w-full rounded-xl border border-line/70 bg-sand/30 px-4 py-3 text-sm text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-colors'

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-slate mb-2">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  )
}
