import { Link } from 'react-router-dom'

/**
 * EmptyState — centred empty-collection screen with optional CTA.
 *
 * @param {{
 *   icon?: import('react').ReactNode,
 *   heading: string,
 *   body?: string,
 *   cta?: { label: string, to: string },
 * }} props
 */
export default function EmptyState({ icon, heading, body, cta }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Icon */}
      {icon && (
        <div className="mb-4 text-neutral-300 dark:text-neutral-600">
          {icon}
        </div>
      )}

      {/* Heading */}
      <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
        {heading}
      </p>

      {/* Body text */}
      {body && (
        <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
          {body}
        </p>
      )}

      {/* CTA button */}
      {cta && (
        <Link
          to={cta.to}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}
