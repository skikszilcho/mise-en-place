import { useRef, useState } from 'react'

/**
 * SearchBar — debounced search input.
 *
 * The visible input is "uncontrolled" from the parent's perspective — the
 * parent receives `onChange` only after the debounce delay, so it never
 * sees every keystroke. A clear button appears when the input is non-empty.
 *
 * Debounce is implemented with useRef + setTimeout/clearTimeout — no library.
 *
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 *   debounceMs?: number,
 *   placeholder?: string,
 * }} props
 */
export default function SearchBar({
  value,
  onChange,
  debounceMs = 200,
  placeholder = 'Search recipes…',
}) {
  // Local display value follows keystrokes immediately; parent is notified
  // after the debounce delay so useMemo re-derivation doesn't run on every key.
  const [localValue, setLocalValue] = useState(value)
  const timerRef = useRef(null)

  function handleChange(e) {
    const next = e.target.value
    setLocalValue(next)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onChange(next)
    }, debounceMs)
  }

  function handleClear() {
    setLocalValue('')
    clearTimeout(timerRef.current)
    onChange('')
  }

  return (
    <div className="relative">
      {/* Search icon */}
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>

      <input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search recipes"
        className="block w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-9 pr-9 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400"
      />

      {/* Clear button — only visible when input is non-empty */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:text-neutral-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
