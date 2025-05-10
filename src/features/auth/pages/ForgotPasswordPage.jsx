import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPasswordForEmail } from '../services/authService'
import { ROUTES } from '../../../config/routes'
import { Button, Input, FormError } from '../../../shared/components'

/**
 * ForgotPasswordPage — collects an email address and sends a
 * Supabase password-reset link to that address.
 *
 * On success the user sees a confirmation message instead of the form.
 * The reset link in the email redirects to /auth/reset-password.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await resetPasswordForEmail(email.trim())

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Check your email
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          We sent a password reset link to <strong>{email}</strong>.
          Click it to set a new password.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white/80">
          Reset your password
        </h2>
        <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-600/80">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

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

        <FormError message={error} />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
        >
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-900 dark:text-neutral-600/80">
        Remembered it?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:underline dark:text-primary-600"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
