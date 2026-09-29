import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Download, Mail, MessageCircle, RefreshCw, Search } from 'lucide-react'
import { db } from '../client'
import { Badge, Btn, Card, ConfirmBtn, ErrorNote, Field, Loading, PageHeader } from '../ui'
import { STATUSES, formatDate, inputClass } from '../adminUtils'
import useToast from '../useToast'

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

function exportCsv(rows) {
  const cols = ['created_at', 'status', 'name', 'company', 'email', 'phone', 'product', 'message', 'channel', 'notes']
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `enquiries-${new Date().toISOString().slice(0, 10)}.csv` })
  a.click()
  URL.revokeObjectURL(url)
}

function Detail({ enquiry: e, onChange, onDelete, onClose }) {
  const [notes, setNotes] = useState(e.notes ?? '')
  const [saving, setSaving] = useState(false)
  const digits = (e.phone ?? '').replace(/[^\d]/g, '')
  const subject = `Re: your enquiry${e.product ? ` — ${e.product}` : ''}`

  const saveNotes = async () => {
    setSaving(true)
    await onChange(e.id, { notes: notes.trim() || null })
    setSaving(false)
  }

  return (
    <Card className="p-6">
      <button type="button" onClick={onClose} className="lg:hidden flex items-center gap-1.5 text-sm font-semibold text-slate mb-4">
        <ArrowLeft className="w-4 h-4" /> All enquiries
      </button>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{e.name}</h2>
          {e.company && <p className="text-sm text-slate">{e.company}</p>}
          <p className="text-xs text-slate mt-1">
            {formatDate(e.created_at)} · via {e.channel ?? 'form'}
          </p>
        </div>
        <Badge tone={e.status}>{e.status}</Badge>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-5">
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate">Email</dt>
          <dd><a className="font-semibold text-deep hover:underline break-all" href={`mailto:${e.email}`}>{e.email}</a></dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate">Phone</dt>
          <dd className="font-semibold text-ink">{e.phone || '—'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wider text-slate">Product / grade</dt>
          <dd className="font-semibold text-ink">{e.product || '—'}</dd>
        </div>
      </dl>

      <p className="text-xs uppercase tracking-wider text-slate mb-1">Message</p>
      <p className="whitespace-pre-wrap rounded-lg bg-sand/60 p-4 text-sm text-ink mb-6">{e.message}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href={`mailto:${e.email}?subject=${encodeURIComponent(subject)}`}
          className="inline-flex items-center gap-2 rounded-lg bg-deep text-ivory px-4 py-2 text-sm font-semibold hover:bg-deep-light"
        >
          <Mail className="w-4 h-4" /> Reply by email
        </a>
        {digits.length >= 7 && (
          <a
            href={`https://wa.me/${digits}?text=${encodeURIComponent(`Hello ${e.name}, thanks for your enquiry${e.product ? ` about ${e.product}` : ''}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] text-white px-4 py-2 text-sm font-semibold hover:bg-[#1fb959]"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        )}
      </div>

      <Field label="Status" className="mb-4">
        <select value={e.status} onChange={(ev) => onChange(e.id, { status: ev.target.value })} className={inputClass}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </Field>
      <Field label="Private notes" hint="Only visible here — e.g. price quoted, follow-up date.">
        <textarea rows={4} value={notes} onChange={(ev) => setNotes(ev.target.value)} className={`${inputClass} resize-y`} />
      </Field>
      <div className="flex flex-wrap justify-between gap-2 mt-4">
        <Btn onClick={saveNotes} busy={saving} disabled={notes === (e.notes ?? '')}>Save notes</Btn>
        <ConfirmBtn onConfirm={() => onDelete(e.id)}>Delete enquiry</ConfirmBtn>
      </div>
    </Card>
  )
}

export default function Enquiries() {
  const [params, setParams] = useSearchParams()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, notify] = useToast()
  const filter = params.get('status') ?? 'all'
  const selectedId = params.get('id')

  const load = useCallback(
    () =>
      db
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)
        .then(({ data, error }) => {
          setError(error ? error.message : null)
          if (!error) setRows(data)
        }),
    [],
  )

  useEffect(() => {
    load()
    // New enquiries arrive while the tab sits open — refresh when the admin comes back to it.
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [load])

  const counts = useMemo(() => {
    const c = { all: rows?.length ?? 0 }
    for (const s of STATUSES) c[s] = rows?.filter((r) => r.status === s).length ?? 0
    return c
  }, [rows])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (rows ?? []).filter(
      (r) =>
        (filter === 'all' || r.status === filter) &&
        (!q || [r.name, r.company, r.email, r.product, r.message].some((v) => v?.toLowerCase().includes(q))),
    )
  }, [rows, filter, search])

  const selected = rows?.find((r) => r.id === selectedId)
  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const update = async (id, patch) => {
    const { data, error } = await db.from('enquiries').update(patch).eq('id', id).select().single()
    if (error) return setError(error.message)
    setRows((rs) => rs.map((r) => (r.id === id ? data : r)))
    notify(patch.status ? `Marked as ${patch.status}` : 'Notes saved')
  }

  const remove = async (id) => {
    const { error } = await db.from('enquiries').delete().eq('id', id)
    if (error) return setError(error.message)
    setRows((rs) => rs.filter((r) => r.id !== id))
    setParam('id', null)
    notify('Enquiry deleted')
  }

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Every quote request sent from the website’s contact form, newest first."
        actions={
          <>
            <Btn variant="outline" onClick={load}><RefreshCw className="w-4 h-4" /> Refresh</Btn>
            <Btn variant="outline" onClick={() => exportCsv(visible)} disabled={!visible.length}><Download className="w-4 h-4" /> Export CSV</Btn>
          </>
        }
      />
      <ErrorNote error={error} />

      <div className="flex flex-wrap gap-2 mb-4">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setParam('status', s === 'all' ? null : s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize border transition-colors ${
              filter === s ? 'bg-deep text-ivory border-deep' : 'border-line text-slate hover:text-ink'
            }`}
          >
            {s} <span className="opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>
      <div className="relative mb-6 max-w-md">
        <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, company, product, message…" className={`${inputClass} pl-9`} />
      </div>

      {!rows ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 items-start">
          <Card className={`divide-y divide-line/60 overflow-hidden ${selected ? 'hidden lg:block' : ''}`}>
            {visible.length === 0 && <p className="p-8 text-center text-sm text-slate">No enquiries here yet.</p>}
            {visible.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setParam('id', r.id)}
                className={`w-full text-left px-5 py-4 hover:bg-sand/60 transition-colors ${r.id === selectedId ? 'bg-sand' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`truncate ${r.status === 'new' ? 'font-bold text-ink' : 'font-semibold text-ink/80'}`}>{r.name}</span>
                  <Badge tone={r.status}>{r.status}</Badge>
                </div>
                <p className="text-sm text-slate truncate mt-0.5">{r.product || r.message}</p>
                <p className="text-xs text-slate/80 mt-1">{formatDate(r.created_at)}{r.company ? ` · ${r.company}` : ''}</p>
              </button>
            ))}
          </Card>
          {selected ? (
            <Detail key={selected.id} enquiry={selected} onChange={update} onDelete={remove} onClose={() => setParam('id', null)} />
          ) : (
            <Card className="hidden lg:block p-10 text-center text-sm text-slate">Select an enquiry to read and reply.</Card>
          )}
        </div>
      )}
      {toast}
    </>
  )
}
