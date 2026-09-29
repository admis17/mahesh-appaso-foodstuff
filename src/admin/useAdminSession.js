import { useEffect, useState } from 'react'
import { db } from './client'

/**
 * Tracks the Supabase session and whether the signed-in user is an admin (listed in public.admins).
 * status: 'loading' | 'signedOut' | 'notAdmin' | 'admin'
 */
export default function useAdminSession() {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let active = true

    const evaluate = async (session) => {
      if (!session) {
        if (active) setState({ status: 'signedOut' })
        return
      }
      const { data, error } = await db.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
      if (!active) return
      setState(data ? { status: 'admin', user: session.user } : { status: 'notAdmin', user: session.user, error: error?.message })
    }

    db.auth.getSession().then(({ data }) => evaluate(data.session))
    // Supabase advises against awaiting its own calls inside this callback, hence the setTimeout.
    const { data: sub } = db.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => evaluate(session), 0)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return state
}
