// Non-component helpers shared by the admin screens.

export const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost', 'spam']

export const inputClass =
  'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold'

export const statusStyles = {
  new: 'bg-gold/20 text-deep',
  contacted: 'bg-sky-100 text-sky-800',
  quoted: 'bg-violet-100 text-violet-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-stone-200 text-stone-700',
  spam: 'bg-rose-100 text-rose-800',
  active: 'bg-emerald-100 text-emerald-800',
  hidden: 'bg-stone-200 text-stone-700',
}

/** One item per line in a textarea ↔ array. */
export const linesToList = (text) => text.split('\n').map((s) => s.trim()).filter(Boolean)
export const listToLines = (list = []) => list.join('\n')

export const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
