import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus } from 'lucide-react'
import { db } from '../client'
import { productCategories } from '../../data/products'
import { productFromRow, productToRow } from '../../data/mapping'
import { Badge, Btn, Card, ConfirmBtn, ErrorNote, Field, Loading, PageHeader } from '../ui'
import { inputClass, linesToList, listToLines } from '../adminUtils'
import useToast from '../useToast'

const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const blank = {
  id: '',
  entry: '',
  name: '',
  shortName: '',
  category: 'rice',
  subcategory: 'non-basmati',
  origin: 'India',
  processing: '',
  specs: [],
  packaging: [],
  markets: [],
  status: 'active',
  verification: 'SOURCE VERIFIED',
}

function validate(p, isNew, existingIds) {
  const e = {}
  if (!p.name.trim()) e.name = 'Required.'
  if (!p.shortName.trim()) e.shortName = 'Required — used in the home page headline.'
  else if (p.shortName.length > 40) e.shortName = 'Keep it under 40 characters.'
  if (!p.entry.trim()) e.entry = 'Required, e.g. ENTRY 017.'
  if (isNew) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id)) e.id = 'Lowercase letters, numbers and single dashes only.'
    else if (existingIds.includes(p.id)) e.id = 'Another product already uses this address.'
  }
  return e
}

function Editor({ product, isNew, existingIds, onSave, onCancel }) {
  const [p, setP] = useState(product)
  const [text, setText] = useState({ specs: listToLines(product.specs), packaging: listToLines(product.packaging), markets: listToLines(product.markets) })
  const [idTouched, setIdTouched] = useState(!isNew)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const groups = productCategories.find((c) => c.slug === p.category)?.groups ?? []

  const set = (key) => (e) => {
    const value = e.target.value
    setP((cur) => {
      const next = { ...cur, [key]: value }
      if (key === 'name' && isNew && !idTouched) next.id = slugify(value)
      if (key === 'category') next.subcategory = productCategories.find((c) => c.slug === value).groups[0].key
      return next
    })
  }

  const save = async () => {
    const full = { ...p, specs: linesToList(text.specs), packaging: linesToList(text.packaging), markets: linesToList(text.markets) }
    const found = validate(full, isNew, existingIds)
    setErrors(found)
    if (Object.keys(found).length) return
    setBusy(true)
    await onSave(full)
    setBusy(false)
  }

  return (
    <Card className="p-6 mb-6">
      <h2 className="font-display text-xl font-semibold text-ink mb-5">{isNew ? 'Add a product' : `Edit ${product.name}`}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" error={errors.name}>
          <input value={p.name} onChange={set('name')} className={inputClass} placeholder="e.g. Silky Sortex Raw IR64" />
        </Field>
        <Field label="Short name" hint="Shown in the rotating home headline and product chips." error={errors.shortName}>
          <input value={p.shortName} onChange={set('shortName')} className={inputClass} placeholder="e.g. IR64 Sortex" />
        </Field>
        <Field
          label="Web address"
          hint={isNew ? `Page: /products/${p.category}/${p.id || '…'}` : 'Fixed after creation so existing links keep working.'}
          error={errors.id}
        >
          <input
            value={p.id}
            disabled={!isNew}
            onChange={(e) => {
              setIdTouched(true)
              setP((cur) => ({ ...cur, id: e.target.value.toLowerCase() }))
            }}
            className={`${inputClass} disabled:bg-sand/60`}
          />
        </Field>
        <Field label="Entry number" error={errors.entry}>
          <input value={p.entry} onChange={set('entry')} className={inputClass} placeholder="ENTRY 017" />
        </Field>
        <Field label="Category">
          <select value={p.category} onChange={set('category')} className={inputClass}>
            {productCategories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Type">
          <select value={p.subcategory} onChange={set('subcategory')} className={inputClass}>
            {groups.map((g) => (
              <option key={g.key} value={g.key}>{g.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Origin">
          <input value={p.origin} onChange={set('origin')} className={inputClass} />
        </Field>
        <Field label="Processing" hint="e.g. raw, sortexed · steam · whole · split">
          <input value={p.processing} onChange={set('processing')} className={inputClass} />
        </Field>
        <Field label="Specifications" hint="One per line. “Broken grades: 5% / 10%” becomes clickable grade chips.">
          <textarea rows={3} value={text.specs} onChange={(e) => setText((t) => ({ ...t, specs: e.target.value }))} className={inputClass} />
        </Field>
        <Field label="Packaging" hint="One per line. Empty shows “On enquiry”.">
          <textarea rows={3} value={text.packaging} onChange={(e) => setText((t) => ({ ...t, packaging: e.target.value }))} className={inputClass} />
        </Field>
        <Field label="Markets" hint="One per line. Empty shows “On enquiry”.">
          <textarea rows={3} value={text.markets} onChange={(e) => setText((t) => ({ ...t, markets: e.target.value }))} className={inputClass} />
        </Field>
        <Field label="Visibility">
          <select value={p.status} onChange={set('status')} className={inputClass}>
            <option value="active">Live on the site</option>
            <option value="hidden">Hidden</option>
          </select>
        </Field>
      </div>
      <div className="flex gap-2 mt-6">
        <Btn onClick={save} busy={busy}>{isNew ? 'Add product' : 'Save changes'}</Btn>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      </div>
    </Card>
  )
}

export default function Products() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null) // product object, or 'new'
  const [toast, notify] = useToast()

  const load = () =>
    db
      .from('products')
      .select('*')
      .order('sort')
      .order('entry')
      .then(({ data, error }) => (error ? setError(error.message) : setRows(data.map((r) => ({ ...productFromRow(r), sort: r.sort })))))
  useEffect(() => {
    load()
  }, [])

  const save = async (p) => {
    const isNew = editing === 'new'
    const row = productToRow({ ...p, sort: isNew ? (rows.at(-1)?.sort ?? 0) + 1 : p.sort })
    const { error } = isNew ? await db.from('products').insert(row) : await db.from('products').update(row).eq('id', p.id)
    if (error) return setError(error.message)
    setError(null)
    setEditing(null)
    notify(isNew ? 'Product added' : 'Product saved')
    load()
  }

  const toggle = async (p) => {
    const status = p.status === 'active' ? 'hidden' : 'active'
    const { error } = await db.from('products').update({ status }).eq('id', p.id)
    if (error) return setError(error.message)
    setRows((rs) => rs.map((r) => (r.id === p.id ? { ...r, status } : r)))
    notify(status === 'active' ? `${p.name} is live` : `${p.name} is hidden`)
  }

  // Swap sort positions with the neighbour; both rows are renumbered by list position first.
  const move = async (index, dir) => {
    const list = rows.map((r, i) => ({ ...r, sort: i }))
    const j = index + dir
    ;[list[index], list[j]] = [list[j], list[index]]
    const renumbered = list.map((r, i) => ({ ...r, sort: i }))
    setRows(renumbered)
    const changed = [renumbered[index], renumbered[j]]
    const results = await Promise.all(changed.map((r) => db.from('products').update({ sort: r.sort }).eq('id', r.id)))
    const failed = results.find((r) => r.error)
    if (failed) setError(failed.error.message)
  }

  const remove = async (p) => {
    const { error } = await db.from('products').delete().eq('id', p.id)
    if (error) return setError(error.message)
    setRows((rs) => rs.filter((r) => r.id !== p.id))
    notify(`${p.name} deleted`)
  }

  const typeLabel = (p) => productCategories.find((c) => c.slug === p.category)?.groups.find((g) => g.key === p.subcategory)?.label ?? p.subcategory

  return (
    <>
      <PageHeader
        title="Products"
        description="What appears in the product list, category pages and the home page. Hidden products disappear from the site but stay here."
        actions={!editing && <Btn onClick={() => setEditing('new')}><Plus className="w-4 h-4" /> Add product</Btn>}
      />
      <ErrorNote error={error} />
      {editing && (
        <Editor
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? blank : editing}
          isNew={editing === 'new'}
          existingIds={(rows ?? []).map((r) => r.id)}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}
      {!rows ? (
        <Loading />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate border-b border-line/60">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {rows.map((p, i) => (
                <tr key={p.id} className={p.status === 'hidden' ? 'opacity-60' : ''}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button type="button" aria-label={`Move ${p.name} up`} disabled={i === 0} onClick={() => move(i, -1)} className="p-1 text-slate hover:text-ink disabled:opacity-20">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button type="button" aria-label={`Move ${p.name} down`} disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="p-1 text-slate hover:text-ink disabled:opacity-20">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-ink">{p.name}</span>
                    <span className="block text-xs text-slate">{p.entry} · {p.shortName}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate capitalize">{p.category} · {typeLabel(p)}</td>
                  <td className="px-4 py-3"><Badge tone={p.status}>{p.status === 'active' ? 'live' : 'hidden'}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Btn variant="ghost" onClick={() => toggle(p)} title={p.status === 'active' ? 'Hide from site' : 'Show on site'}>
                        {p.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Btn>
                      <Btn variant="outline" onClick={() => setEditing(p)}><Pencil className="w-4 h-4" /> Edit</Btn>
                      <ConfirmBtn onConfirm={() => remove(p)} confirmLabel="Confirm delete">Delete</ConfirmBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {toast}
    </>
  )
}
