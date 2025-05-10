import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithGoogle, signInWithPassword } from '../services/authService'
import { ROUTES } from '../../../config/routes'
import { Button, Input, FormError } from '../../../shared/components'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

/**
 * LoginPage — email/password login form with Google OAuth option.
 *
 * Authentication flow:
 *  - Email/password: calls supabase.auth.signInWithPassword; on success
 *    the AuthProvider's onAuthStateChange fires and ProtectedRoute
 *    redirects to /recipes automatically.
 *  - Google OAuth: triggers a redirect flow; on return the browser
 *    lands on /auth/callback which exchanges the code for a session.
 */
export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await signInWithPassword({
      email: email.trim(),
      password,
      options: { persistSession: rememberMe },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    // onAuthStateChange in AuthProvider will update session state;
    // navigate to recipes so ProtectedRoute can render.
    navigate(ROUTES.RECIPES, { replace: true })
  }

  async function handleGoogleSignIn() {
    setError(null)
    setOauthLoading(true)

    const { error: authError } = await signInWithGoogle(
      `${window.location.origin}${ROUTES.AUTH_CALLBACK}`
    )

    // If signInWithOAuth errors before redirecting (e.g., provider not enabled),
    // surface the message. If it succeeds the browser navigates away.
    if (authError) {
      setOauthLoading(false)
      setError(authError.message)
    }
  }

  function handleForgotPassword() {
    navigate(ROUTES.FORGOT_PASSWORD)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white/80">
          Sign in
        </h2>
        <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-600/80">
          Welcome back
        </p>
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="secondary"
        loading={oauthLoading}
        onClick={handleGoogleSignIn}
        className="w-full bg-white"
      >
        {/* Simple G icon inline — no external image dependency */}
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        <span className="text-xs text-neutral-900">or</span>
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      </div>

      {/* Email / password form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-900 text-primary-800 focus:ring-primary-800"
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <FormError message={error} />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-900 dark:text-neutral-600/80">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-primary-600 hover:underline dark:text-primary-600"
        >
          Register
        </Link>
      </p>
    </div>
  )
}
