/**
 * Input — reusable labelled form input with integrated error display.
 *
 * @param {{
 *   label: string,
 *   id: string,
 *   error?: string,
 *   helpText?: string,
 * } & import('react').InputHTMLAttributes<HTMLInputElement>} props
 */

import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function Input({
  label,
  id,
  error,
  helpText,
  className = '',
  ...rest
}) {
  const inputBase =
    'block w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:bg-white/5 dark:text-neutral-900 dark:placeholder-neutral-600'

  const inputState = error
    ? 'border-error-500 focus-visible:ring-error-500'
    : 'border-neutral-300 focus-visible:ring-primary-500 dark:border-neutral-600'

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-neutral-700 dark:text-neutral-600"
      >
        {label}
      </label>

      <div className="relative">
        {rest.type === "email" && (
          <Mail
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-700"
          />
        )}

        {rest.type === "password" && (
          <Lock
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-700"
          />
        )}

        <input
          id={id}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          aria-invalid={!!error}
          className={`${inputBase} ${inputState} ${className}`}
          {...rest}
        />
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-error-600 dark:text-error-400">
          {error}
        </p>
      )}

      {!error && helpText && (
        <p id={`${id}-help`} className="text-xs text-neutral-500 dark:text-neutral-700">
          {helpText}
        </p>
      )}
    </div>
  )
}
