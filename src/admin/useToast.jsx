import { useEffect, useState } from 'react'

/** Brief confirmation message, e.g. after saving. */
export default function useToast() {
  const [message, setMessage] = useState(null)
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 2500)
    return () => clearTimeout(t)
  }, [message])
  const toast = message ? (
    <div role="status" className="fixed bottom-6 right-6 z-50 rounded-lg bg-deep text-ivory text-sm font-semibold px-4 py-3 shadow-xl">
      {message}
    </div>
  ) : null
  return [toast, setMessage]
}
