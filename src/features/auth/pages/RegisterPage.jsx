import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { signUp } from '../services/authService'
import { ROUTES } from '../../../config/routes'
import { Button, Input, FormError } from '../../../shared/components'
import PasswordStrength from "../components/PasswordStrength";

/**
 * RegisterPage — new account creation with email and password.
 *
 * On successful signup, Supabase sends a confirmation email.
 * The user sees a "check your email" message rather than being
 * immediately navigated — they must confirm before they can sign in.
 */
export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState(false)

  function validate() {
    const errors = {}
    if (!email.trim()) errors.email = 'Email is required'
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
    if (confirmPassword !== password)
      errors.confirmPassword = 'Passwords do not match'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)

    const { error: authError } = await signUp({
      email: email.trim(),
      password,
    })

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
          {/* Envelope icon */}
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Check your email
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account, then come back to sign in.
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
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-black-400">
          Start contributing to THE recipe collection
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <Input
          id="password"
          label="Password"
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
          label="Confirm password"
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
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-700 dark:text-neutral-700">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-700 hover:underline dark:text-primary-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
