import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus } from 'lucide-react'
import { db } from '../client'
import { Badge, Btn, Card, ConfirmBtn, ErrorNote, Field, Loading, PageHeader } from '../ui'
import { inputClass } from '../adminUtils'
import useToast from '../useToast'

const blank = { name: '', location: '', quote: '', published: true }

function Editor({ item, onSave, onCancel }) {
  const [t, setT] = useState(item)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setT((cur) => ({ ...cur, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const save = async () => {
    const found = {}
    if (!t.name.trim()) found.name = 'Required — e.g. “Wholesale Buyer”.'
    if (!t.quote.trim()) found.quote = 'Required.'
    else if (t.quote.length > 600) found.quote = 'Keep it under 600 characters.'
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    await onSave({ ...t, name: t.name.trim(), location: t.location.trim(), quote: t.quote.trim() })
    setBusy(false)
  }

  return (
    <Card className="p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Who said it" hint="A role works well if the buyer prefers not to be named." error={errors.name}>
          <input value={t.name} onChange={set('name')} className={inputClass} />
        </Field>
        <Field label="Where / what" hint="e.g. Import partner, East Africa">
          <input value={t.location} onChange={set('location')} className={inputClass} />
        </Field>
        <Field label="Quote" error={errors.quote} className="sm:col-span-2">
          <textarea rows={3} value={t.quote} onChange={set('quote')} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={t.published} onChange={set('published')} className="w-4 h-4 accent-deep" />
          Show on the home page
        </label>
      </div>
      <div className="flex gap-2 mt-6">
        <Btn onClick={save} busy={busy}>Save</Btn>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </Card>
  )
}

export default function Testimonials() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [toast, notify] = useToast()

  const load = () =>
    db
      .from('testimonials')
      .select('*')
      .order('sort')
      .then(({ data, error }) => (error ? setError(error.message) : setRows(data)))
  useEffect(() => {
    load()
  }, [])

  const save = async (t) => {
    const row = { name: t.name, location: t.location, quote: t.quote, published: t.published }
    const { error } = t.id
      ? await db.from('testimonials').update(row).eq('id', t.id)
      : await db.from('testimonials').insert({ ...row, sort: (rows.at(-1)?.sort ?? 0) + 1 })
    if (error) return setError(error.message)
    setError(null)
    setEditing(null)
    notify('Testimonial saved')
    load()
  }

  const move = async (index, dir) => {
    const list = [...rows]
    const j = index + dir
    ;[list[index], list[j]] = [list[j], list[index]]
    const renumbered = list.map((r, i) => ({ ...r, sort: i }))
    setRows(renumbered)
    await Promise.all([renumbered[index], renumbered[j]].map((r) => db.from('testimonials').update({ sort: r.sort }).eq('id', r.id)))
  }

  const remove = async (t) => {
    const { error } = await db.from('testimonials').delete().eq('id', t.id)
    if (error) return setError(error.message)
    setRows((rs) => rs.filter((r) => r.id !== t.id))
    notify('Testimonial deleted')
  }

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Buyer quotes shown in the home page “What Buyers Say” section, in this order."
        actions={!editing && <Btn onClick={() => setEditing(blank)}><Plus className="w-4 h-4" /> Add testimonial</Btn>}
      />
      <ErrorNote error={error} />
      {editing && <Editor key={editing.id ?? 'new'} item={editing} onSave={save} onCancel={() => setEditing(null)} />}
      {!rows ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {rows.length === 0 && <Card className="p-8 text-center text-sm text-slate">No testimonials — the home page section is hidden until you add one.</Card>}
          {rows.map((t, i) => (
            <Card key={t.id} className={`p-5 flex flex-col sm:flex-row gap-4 ${t.published ? '' : 'opacity-60'}`}>
              <div className="flex sm:flex-col gap-1">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="p-1 text-slate hover:text-ink disabled:opacity-20">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button type="button" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="p-1 text-slate hover:text-ink disabled:opacity-20">
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ink">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-sm text-slate mt-2">
                  <span className="font-semibold text-ink">{t.name}</span>
                  {t.location ? ` · ${t.location}` : ''}
                </p>
              </div>
              <div className="flex sm:flex-col items-end gap-2">
                <Badge tone={t.published ? 'active' : 'hidden'}>{t.published ? 'shown' : 'hidden'}</Badge>
                <div className="flex gap-1.5">
                  <Btn variant="outline" onClick={() => setEditing(t)}><Pencil className="w-4 h-4" /> Edit</Btn>
                  <ConfirmBtn onConfirm={() => remove(t)} confirmLabel="Confirm">Delete</ConfirmBtn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {toast}
    </>
  )
}
