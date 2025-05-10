import { useMemo } from 'react'

/**
 * TagFilterChips — toggleable tag filter chips.
 *
 * Derives the unique tag set from the full (unfiltered) recipe list using
 * useMemo so the derivation only re-runs when the recipe list changes.
 * Each chip is a <button> that toggles its inclusion in the active tag set.
 * Active chips are highlighted with the primary colour.
 *
 * @param {{
 *   recipes: object[],
 *   activeTags: string[],
 *   onChange: (tags: string[]) => void,
 * }} props
 */
export default function TagFilterChips({ recipes, activeTags, onChange }) {
  // Derive the sorted unique tag set from all recipes (not just visible ones)
  const allTags = useMemo(() => {
    const set = new Set()
    for (const recipe of recipes) {
      for (const tag of recipe.tags ?? []) {
        set.add(tag.toLowerCase())
      }
    }
    return [...set].sort()
  }, [recipes])

  if (allTags.length === 0) return null

  function toggle(tag) {
    if (activeTags.includes(tag)) {
      onChange(activeTags.filter((t) => t !== tag))
    } else {
      onChange([...activeTags, tag])
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      {allTags.map((tag) => {
        const isActive = activeTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            aria-pressed={isActive}
            className={
              isActive
                ? 'rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 bg-primary-600 text-white'
                : 'rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }
          >
            {tag}
          </button>
        )
      })}

      {/* Clear all — only shown when at least one tag is active */}
      {activeTags.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="rounded-full px-3 py-1 text-xs font-semibold text-neutral-400 underline-offset-2 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          Clear
        </button>
      )}
    </div>
  )
}
