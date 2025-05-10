/**
 * ErrorMessage — red-tinted error block with a warning icon.
 *
 * Used in every page that can fail a data fetch. Replaces raw error strings
 * and FormError in non-form contexts (FormError is still used inside forms
 * as a form-level error banner; ErrorMessage is for page-level fetch failures).
 *
 * @param {{ message: string|null|undefined }} props
 */
export default function ErrorMessage({ message }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl bg-error-50 px-4 py-3 ring-1 ring-error-200 dark:bg-error-950 dark:ring-error-800"
    >
      {/* Warning icon */}
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-error-500 dark:text-error-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>

      <p className="text-sm text-error-700 dark:text-error-300">
        {message}
      </p>
    </div>
  )
}
