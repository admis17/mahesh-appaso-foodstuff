import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../client'
import { Btn, Field } from '../ui'
import { inputClass } from '../adminUtils'

/** Landing page for invite and password-reset emails: the link signs the user in, then they choose a password. */
export default function SetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const save = async (e) => {
    e.preventDefault()
    if (password.length < 10) return setError('Use at least 10 characters.')
    if (password !== confirm) return setError('The two passwords don’t match.')
    setBusy(true)
    setError(null)
    const { error } = await db.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(error.message)
    else navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep px-6">
      <form onSubmit={save} className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-2xl">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Choose a password</h1>
        <p className="text-sm text-slate mb-6">You’ll use it with your email to sign in to the admin.</p>
        <div className="space-y-4">
          <Field label="New password" hint="At least 10 characters.">
            <input type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Repeat password">
            <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
          </Field>
        </div>
        {error && <p className="text-sm text-rust mt-4">{error}</p>}
        <Btn type="submit" busy={busy} className="w-full mt-6">Save password</Btn>
      </form>
    </div>
  )
}
