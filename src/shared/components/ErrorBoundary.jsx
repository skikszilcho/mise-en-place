import { Component } from 'react'
import { logger } from '../utils'

/**
 * ErrorBoundary — global React error boundary.
 *
 * This is intentionally a class component. React's error boundary API
 * (getDerivedStateFromError + componentDidCatch) is only available on class
 * components; there is no functional-component equivalent. This is the single
 * class component in the entire project. Every other component is a function
 * component. This exception is deliberate, documented, and bounded.
 *
 * Placement: wrap the router outlet in App.jsx so render-phase errors from any
 * page are caught here rather than propagating to a white screen.
 *
 * Note: error boundaries do NOT catch errors in:
 *   - Async event handlers (caught by withErrorHandling in the service layer)
 *   - Server-side rendering
 *   - The error boundary component itself
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    /** @type {{ hasError: boolean, error: Error | null }} */
    this.state = { hasError: false, error: null }
  }

  /**
   * Update state so the next render shows the fallback UI.
   * Called during the render phase — must be a pure function with no side effects.
   *
   * @param {Error} error
   * @returns {{ hasError: boolean, error: Error }}
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  /**
   * Log the error and its component stack for debugging.
   * Called after the commit phase — safe to run side effects here.
   *
   * @param {Error} error
   * @param {{ componentStack: string }} info
   */
  componentDidCatch(error, info) {
    logger.error('Unhandled render error', { error, componentStack: info.componentStack })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              {/* Warning icon — inline SVG, no external dependency */}
              <svg
                className="mx-auto h-16 w-16 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              An unexpected error occurred. Our team has been notified. You can
              try reloading the page to recover.
            </p>

            {this.state.error?.message && (
              <p className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400 text-left font-mono break-all">
                {this.state.error.message}
              </p>
            )}

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
