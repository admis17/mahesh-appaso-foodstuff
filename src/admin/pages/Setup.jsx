/** Shown at /admin until Supabase keys are configured: setup steps, plus a sample-data preview. */
export default function Setup({ onPreview }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand/40 px-6">
      <div className="max-w-lg rounded-2xl bg-ivory border border-line/70 p-8">
        <p className="eyebrow text-rust mb-2">Admin not connected yet</p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-4">Connect the database to use the admin</h1>
        <p className="text-sm text-slate mb-4">
          The admin stores content and enquiries in Supabase. Until it&apos;s connected, the public site runs on its
          built-in content and enquiries go straight to WhatsApp or email without being saved.
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-ink">
          <li>Create a free Supabase project.</li>
          <li>Run <code className="text-xs bg-sand px-1 rounded">supabase/schema.sql</code>, then <code className="text-xs bg-sand px-1 rounded">supabase/seed.sql</code>, in its SQL editor.</li>
          <li>Set <code className="text-xs bg-sand px-1 rounded">VITE_SUPABASE_URL</code> and <code className="text-xs bg-sand px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in Vercel and redeploy.</li>
          <li>Invite yourself as a user and add your id to the admins table.</li>
        </ol>
        <p className="text-sm text-slate mt-4">
          Full steps are in <code className="text-xs bg-sand px-1 rounded">ADMIN.md</code> in the project.
        </p>
        <div className="mt-6 pt-6 border-t border-line/70">
          <p className="text-sm text-slate mb-3">Want to see the admin first? Try it with sample products and enquiries — nothing is saved.</p>
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center justify-center rounded-lg bg-deep text-ivory px-5 py-2.5 text-sm font-semibold hover:bg-deep-light"
          >
            Preview the admin with sample data
          </button>
        </div>
      </div>
    </div>
  )
}
