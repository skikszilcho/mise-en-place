import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChange } from '../services/authService'
import { ROUTES } from '../../../config/routes'
import { Spinner } from '../../../shared/components'
import { logger } from '../../../shared/utils'

/**
 * AuthCallback — handles the OAuth PKCE redirect from Supabase.
 *
 * When a user completes Google OAuth, Supabase redirects the browser
 * to /auth/callback with a `code` query parameter. The Supabase client
 * detects the code automatically on page load and exchanges it for a
 * session internally — we must NOT call exchangeCodeForSession() manually
 * or the code gets consumed twice, causing the "code verifier non-empty"
 * error. Instead we subscribe to onAuthStateChange and navigate once the
 * session is confirmed, or bail to /login if an error event fires.
 */
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate(ROUTES.RECIPES, { replace: true })
        return
      }
      if (event === 'TOKEN_REFRESHED' && session) {
        navigate(ROUTES.RECIPES, { replace: true })
        return
      }
      if (event === 'SIGNED_OUT' || (event !== 'INITIAL_SESSION' && !session)) {
        logger.error('AuthCallback: session exchange failed', { event })
        navigate(ROUTES.LOGIN, { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Completing sign in…
        </p>
      </div>
    </div>
  )
}
