import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from '../services/authService'
import { calculatePasswordStrength } from '../utils/passwordStrength'
import { ROUTES } from '../../../config/routes'
import { Button, Input, FormError } from '../../../shared/components'
import PasswordStrength from '../components/PasswordStrength'

/**
 * ResetPasswordPage — lets a user set a new password after clicking the
 * reset link in their email.
 *
 * Supabase exchanges the token in the URL for a session before this page
 * renders (handled by AuthCallback / Supabase's detectSessionInUrl). By
 * the time the user reaches this page they already have an active session,
 * so updatePassword() works without any additional token argument.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const strength = calculatePasswordStrength(password)

  function validate() {
    const errors = {}
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (password.length > 128) {
      errors.password = 'Password must be less than 128 characters'
    } else if (!/\d/.test(password)) {
      errors.password = 'Password must contain a number'
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain an uppercase letter'
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match'
    }
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const { error: authError } = await updatePassword(password)

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white/80">
          Set a new password
        </h2>
        <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-600/80">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          helpText="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        <PasswordStrength password={password} />

        <Input
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <FormError message={error} />

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full"
          disabled={strength.score < 5}
        >
          Update password
        </Button>
      </form>
    </div>
  )
}
