import { Outlet } from 'react-router-dom'
import Header from './Header'

/**
 * AppLayout — authenticated page chrome.
 *
 * Wraps all protected routes with the persistent Header and a centred
 * <main> content area. Applies the page background for both light and
 * dark themes.
 *
 * The max-width and horizontal padding mirror the Header's inner container
 * so content aligns to the same grid edge on every breakpoint.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
