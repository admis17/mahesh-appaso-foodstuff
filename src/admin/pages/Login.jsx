import { useState } from 'react'
import { db } from '../client'
import { Btn, Field } from '../ui'
import { inputClass } from '../adminUtils'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const signIn = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await db.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setError(error.message === 'Invalid login credentials' ? 'Email or password is incorrect.' : error.message)
  }

  const reset = async () => {
    if (!email.trim()) return setError('Enter your email first, then choose “Forgot password”.')
    setBusy(true)
    setError(null)
    const { error } = await db.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/set-password`,
    })
    setBusy(false)
    if (error) setError(error.message)
    else setNotice('If that email belongs to an admin, a reset link is on its way.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep px-6">
      <form onSubmit={signIn} className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-2xl">
        <p className="eyebrow text-rust mb-2">Mahesh Rice Trading</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-6">Admin sign in</h1>
        <div className="space-y-4">
          <Field label="Email">
            <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Password">
            <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </Field>
        </div>
        {error && <p className="text-sm text-rust mt-4">{error}</p>}
        {notice && <p className="text-sm text-deep mt-4">{notice}</p>}
        <Btn type="submit" busy={busy} className="w-full mt-6">Sign in</Btn>
        <button type="button" onClick={reset} className="block mx-auto mt-4 text-xs font-semibold text-slate hover:text-deep">
          Forgot password
        </button>
      </form>
    </div>
  )
}
