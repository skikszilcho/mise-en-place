/**
 * Spinner — small animated loading indicator.
 * Used by ProtectedRoute while session state is being determined,
 * and as a button loading state in forms.
 *
 * @param {{ size?: 'sm'|'md'|'lg', className?: string }} props
 */
export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-neutral-300 border-t-primary-600 ${sizeClasses[size]} ${className}`}
    />
  )
}
