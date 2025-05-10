import { SORT_OPTIONS } from '../utils/recipeFilters'

/**
 * SortDropdown — sort key selector.
 *
 * Renders a styled <select> element with one option per sort key.
 * Labels are sourced from the SORT_OPTIONS constant in recipeFilters.js
 * so the display strings and sort keys are defined in one place.
 *
 * @param {{
 *   value: string,
 *   onChange: (sortKey: string) => void,
 * }} props
 */
export default function SortDropdown({ value, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">
        Sort recipes
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full appearance-none rounded-lg border border-neutral-300 bg-white py-2.5 pl-3 pr-8 text-sm text-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
      >
        {Object.entries(SORT_OPTIONS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}
