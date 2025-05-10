import { forwardRef } from 'react'
import Spinner from './Spinner'

/**
 * Button — reusable styled button with variant and loading state support.
 * Forwards refs so it can be used as the initial focus target in dialogs.
 *
 * @type {import('react').ForwardRefExoticComponent<{
 *   variant?: 'primary'|'secondary'|'danger'|'ghost',
 *   loading?: boolean,
 *   children: import('react').ReactNode,
 * } & import('react').ButtonHTMLAttributes<HTMLButtonElement>>}
 */
const Button = forwardRef(function Button({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  disabled,
  ...rest
}, ref) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary:
      'bg-white text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 focus-visible:ring-neutral-400 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-600 dark:hover:bg-neutral-700',
    danger:
      'bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500',
    ghost:
      'text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-400 dark:text-neutral-300 dark:hover:bg-neutral-800',
  }

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
})

export default Button
