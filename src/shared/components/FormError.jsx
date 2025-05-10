/**
 * FormError — inline form-level error banner.
 * Displayed below the form submit button for server-side or
 * global form errors (as distinct from per-field Input errors).
 *
 * @param {{ message: string|null|undefined }} props
 */
export default function FormError({ message }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-700 ring-1 ring-error-200 dark:bg-error-950 dark:text-error-300 dark:ring-error-800"
    >
      {message}
    </div>
  )
}
