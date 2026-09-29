import { useEffect, useState } from 'react'
import { db } from '../client'
import { company } from '../../data/company'
import { settingsFromCompany } from '../../data/mapping'
import { Btn, Card, ErrorNote, Field, Loading, PageHeader } from '../ui'
import { inputClass } from '../adminUtils'
import useToast from '../useToast'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CompanySettings() {
  const [s, setS] = useState(null)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [toast, notify] = useToast()

  useEffect(() => {
    db
      .from('settings')
      .select('data')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return setError(error.message)
        // Start from the built-in details so every field is present, then layer saved values on top.
        const base = settingsFromCompany(company)
        const saved = data?.data ?? {}
        setS({ ...base, ...saved, address: { ...base.address, ...saved.address }, social: { ...base.social, ...saved.social } })
      })
  }, [])

  const set = (key) => (e) => setS((cur) => ({ ...cur, [key]: e.target.value }))
  const setIn = (group, key) => (e) => setS((cur) => ({ ...cur, [group]: { ...cur[group], [key]: e.target.value } }))

  const save = async () => {
    const found = {}
    if (!EMAIL.test(s.email.trim())) found.email = 'Enter a valid email address.'
    if (s.whatsapp.replace(/[^\d]/g, '').length < 8) found.whatsapp = 'Include the country code, e.g. 971528186624.'
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    const { error } = await db.from('settings').upsert({ id: 1, data: s })
    setBusy(false)
    if (error) return setError(error.message)
    setError(null)
    notify('Saved — visitors see the change on their next page load')
  }

  if (error && !s) return <ErrorNote error={error} />
  if (!s) return <Loading />

  return (
    <>
      <PageHeader title="Company details" description="Contact details and links used across the site — header, footer, contact page, WhatsApp buttons and quote emails." />
      <ErrorNote error={error} />
      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">How buyers reach you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Field label="Email" hint="Enquiries sent “via email” go here." error={errors.email}>
            <input type="email" value={s.email} onChange={set('email')} className={inputClass} />
          </Field>
          <Field label="WhatsApp number" hint="Digits with country code, no + or spaces." error={errors.whatsapp}>
            <input value={s.whatsapp} onChange={set('whatsapp')} inputMode="tel" className={inputClass} />
          </Field>
          <Field label="Phone (for tel: links)">
            <input value={s.phone} onChange={set('phone')} inputMode="tel" className={inputClass} />
          </Field>
          <Field label="Working hours">
            <input value={s.hours} onChange={set('hours')} className={inputClass} />
          </Field>
        </div>

        <h2 className="font-display text-lg font-semibold text-ink mb-4">Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Field label="Line 1"><input value={s.address.line1} onChange={setIn('address', 'line1')} className={inputClass} /></Field>
          <Field label="Line 2"><input value={s.address.line2} onChange={setIn('address', 'line2')} className={inputClass} /></Field>
          <Field label="City"><input value={s.address.city} onChange={setIn('address', 'city')} className={inputClass} /></Field>
          <Field label="Country"><input value={s.address.country} onChange={setIn('address', 'country')} className={inputClass} /></Field>
          <Field label="Google Maps embed link" hint="Google Maps → Share → Embed a map → copy the src=… address." className="sm:col-span-2">
            <input value={s.mapEmbedSrc} onChange={set('mapEmbedSrc')} className={inputClass} />
          </Field>
        </div>

        <h2 className="font-display text-lg font-semibold text-ink mb-4">Social links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Field label="Instagram"><input value={s.social.instagram} onChange={setIn('social', 'instagram')} className={inputClass} /></Field>
          <Field label="LinkedIn"><input value={s.social.linkedin} onChange={setIn('social', 'linkedin')} className={inputClass} /></Field>
          <Field label="Facebook"><input value={s.social.facebook} onChange={setIn('social', 'facebook')} className={inputClass} /></Field>
        </div>

        <h2 className="font-display text-lg font-semibold text-ink mb-4">Registration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Trade licence number"><input value={s.licenseNumber} onChange={set('licenseNumber')} className={inputClass} /></Field>
          <Field label="TRN (VAT)"><input value={s.trn} onChange={set('trn')} className={inputClass} /></Field>
        </div>

        <Btn onClick={save} busy={busy} className="mt-8">Save company details</Btn>
      </Card>
      {toast}
    </>
  )
}
