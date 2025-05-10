import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth'
import { ROUTES } from '../../config/routes'
import { Spinner } from '../../shared/components'

/**
 * ProtectedRoute — route-level authorisation guard.
 *
 * Renders the child route (<Outlet />) only when an authenticated
 * session exists. Handles three states:
 *
 *  1. Loading  — session check in flight; renders a centred spinner
 *               to prevent a flash of the login page on refresh.
 *  2. No session — redirects to /login (replace so the back button
 *                  doesn't return to the protected route).
 *  3. Session present — renders the child route normally.
 *
 * This component is the React Router equivalent of a middleware
 * guard. Authorisation at the data layer is enforced separately
 * by Supabase Row Level Security (Sub-Task 2).
 */
export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
