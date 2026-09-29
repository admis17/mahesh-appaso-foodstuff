import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus } from 'lucide-react'
import { db } from '../client'
import { Btn, Card, ConfirmBtn, ErrorNote, Field, Loading, PageHeader } from '../ui'
import { inputClass } from '../adminUtils'
import useToast from '../useToast'

const blank = { name: '', countries: '', lon: '', lat: '', map_label: 'above' }

function Editor({ item, onSave, onCancel }) {
  const [r, setR] = useState({ ...item, lon: String(item.lon), lat: String(item.lat) })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setR((cur) => ({ ...cur, [key]: e.target.value }))

  const save = async () => {
    const lon = Number(r.lon)
    const lat = Number(r.lat)
    const found = {}
    if (!r.name.trim()) found.name = 'Required.'
    else if (r.name.length > 40) found.name = 'Keep it under 40 characters.'
    if (r.lon.trim() === '' || Number.isNaN(lon) || lon < -180 || lon > 180) found.lon = 'A number between -180 and 180.'
    if (r.lat.trim() === '' || Number.isNaN(lat) || lat < -90 || lat > 90) found.lat = 'A number between -90 and 90.'
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    await onSave({ ...r, name: r.name.trim(), countries: r.countries.trim(), lon, lat })
    setBusy(false)
  }

  return (
    <Card className="p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Region name" error={errors.name}>
          <input value={r.name} onChange={set('name')} className={inputClass} placeholder="e.g. West Africa" />
        </Field>
        <Field label="Countries" hint="Comma-separated, as it should read on the card.">
          <input value={r.countries} onChange={set('countries')} className={inputClass} placeholder="Nigeria, Ghana, Senegal" />
        </Field>
        <Field label="Map marker — longitude" hint="East is positive. Dubai is 55.3." error={errors.lon}>
          <input value={r.lon} onChange={set('lon')} inputMode="decimal" className={inputClass} />
        </Field>
        <Field label="Map marker — latitude" hint="North is positive. Dubai is 25.2." error={errors.lat}>
          <input value={r.lat} onChange={set('lat')} inputMode="decimal" className={inputClass} />
        </Field>
        <Field label="Label position" hint="Move the map label below the marker if it overlaps another.">
          <select value={r.map_label} onChange={set('map_label')} className={inputClass}>
            <option value="above">Above the marker</option>
            <option value="below">Below the marker</option>
          </select>
        </Field>
      </div>
      <p className="text-xs text-slate mt-4">
        Tip: find coordinates by right-clicking a city on Google Maps — the first number is latitude, the second longitude.
      </p>
      <div className="flex gap-2 mt-6">
        <Btn onClick={save} busy={busy}>Save</Btn>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </Card>
  )
}

export default function Regions() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [toast, notify] = useToast()

  const load = () =>
    db
      .from('regions')
      .select('*')
      .order('sort')
      .then(({ data, error }) => (error ? setError(error.message) : setRows(data)))
  useEffect(() => {
    load()
  }, [])

  const save = async (r) => {
    const row = { name: r.name, countries: r.countries, lon: r.lon, lat: r.lat, map_label: r.map_label }
    const { error } = r.id
      ? await db.from('regions').update(row).eq('id', r.id)
      : await db.from('regions').insert({ ...row, sort: (rows.at(-1)?.sort ?? 0) + 1 })
    if (error) return setError(error.message)
    setError(null)
    setEditing(null)
    notify('Region saved')
    load()
  }

  const move = async (index, dir) => {
    const list = [...rows]
    const j = index + dir
    ;[list[index], list[j]] = [list[j], list[index]]
    const renumbered = list.map((r, i) => ({ ...r, sort: i }))
    setRows(renumbered)
    await Promise.all([renumbered[index], renumbered[j]].map((r) => db.from('regions').update({ sort: r.sort }).eq('id', r.id)))
  }

  const remove = async (r) => {
    const { error } = await db.from('regions').delete().eq('id', r.id)
    if (error) return setError(error.message)
    setRows((rs) => rs.filter((x) => x.id !== r.id))
    notify('Region deleted')
  }

  return (
    <>
      <PageHeader
        title="Regions"
        description="Markets shown on the home page route map, the region cards and the Global Reach departures board."
        actions={!editing && <Btn onClick={() => setEditing(blank)}><Plus className="w-4 h-4" /> Add region</Btn>}
      />
      <ErrorNote error={error} />
      {editing && <Editor key={editing.id ?? 'new'} item={editing} onSave={save} onCancel={() => setEditing(null)} />}
      {!rows ? (
        <Loading />
      ) : (
        <Card className="divide-y divide-line/60">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex flex-col">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="p-0.5 text-slate hover:text-ink disabled:opacity-20">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button type="button" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="p-0.5 text-slate hover:text-ink disabled:opacity-20">
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink">{r.name}</p>
                <p className="text-sm text-slate truncate">{r.countries || '—'}</p>
              </div>
              <span className="hidden sm:block text-xs text-slate tabular-nums">{r.lat}°, {r.lon}°</span>
              <div className="flex gap-1.5">
                <Btn variant="outline" onClick={() => setEditing(r)}><Pencil className="w-4 h-4" /> Edit</Btn>
                <ConfirmBtn onConfirm={() => remove(r)} confirmLabel="Confirm">Delete</ConfirmBtn>
              </div>
            </div>
          ))}
        </Card>
      )}
      {toast}
    </>
  )
}
