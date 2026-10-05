import { Component } from 'react'

// Last resort if a page crashes at runtime: a calm full-screen message instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="eyebrow text-gold mb-4">Something went wrong</p>
          <h1 className="font-display text-3xl font-semibold text-ink mb-4">This page could not be shown</h1>
          <p className="text-sm text-slate leading-relaxed mb-8">
            Please reload the page. If it keeps happening, reach us on WhatsApp or email and we will help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center font-semibold tracking-wide uppercase rounded-full px-7 py-3.5 text-sm bg-deep text-ivory hover:bg-pine transition-colors"
            >
              Reload page
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center font-semibold tracking-wide uppercase rounded-full px-7 py-3.5 text-sm border border-ink/20 text-ink hover:border-gold hover:text-gold transition-colors"
            >
              Back home
            </a>
          </div>
        </div>
      </div>
    )
  }
}
