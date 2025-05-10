/**
 * recipeFilters — pure filter, sort, and pagination functions.
 *
 * No React imports. No Supabase imports. Every function here is
 * independently unit-testable with plain JavaScript arrays.
 *
 * Architectural note:
 *   These functions operate on the full in-memory recipe list (Phase 1
 *   client-side strategy). When the collection grows large enough to
 *   warrant server-side filtering, only recipeService.fetchRecipes()
 *   needs updating — these functions are unchanged.
 */

// ── Sort key constants ────────────────────────────────────────────────────────

/** @type {Record<string, string>} Human-readable labels for each sort key */
export const SORT_OPTIONS = {
  newest:   'Newest first',
  oldest:   'Oldest first',
  az:       'Title A–Z',
  za:       'Title Z–A',
  quickest: 'Quickest first',
}

// ── Filter ────────────────────────────────────────────────────────────────────

/**
 * Filter a recipe list by search query, active tags, and cuisine.
 *
 * - `query` matches case-insensitively against title, cuisine, and any tag
 * - `tags` filter requires **all** selected tags to be present on the recipe
 * - `cuisine` matches case-insensitively (exact word match)
 *
 * @param {object[]} recipes
 * @param {{ query?: string, tags?: string[], cuisine?: string }} filters
 * @returns {object[]}
 */
export function filterRecipes(recipes, { query = '', tags = [], cuisine = '' } = {}) {
  const q = query.trim().toLowerCase()
  const activeTags = tags.map((t) => t.toLowerCase())
  const activeCuisine = cuisine.trim().toLowerCase()

  return recipes.filter((recipe) => {
    // ── Query match ────────────────────────────────────────────────
    if (q) {
      const titleMatch    = (recipe.title   ?? '').toLowerCase().includes(q)
      const cuisineMatch  = (recipe.cuisine ?? '').toLowerCase().includes(q)
      const tagMatch      = (recipe.tags ?? []).some((t) => t.toLowerCase().includes(q))
      if (!titleMatch && !cuisineMatch && !tagMatch) return false
    }

    // ── Tag filter (all selected tags must be present) ─────────────
    if (activeTags.length > 0) {
      const recipeTags = (recipe.tags ?? []).map((t) => t.toLowerCase())
      if (!activeTags.every((t) => recipeTags.includes(t))) return false
    }

    // ── Cuisine filter ─────────────────────────────────────────────
    if (activeCuisine) {
      if ((recipe.cuisine ?? '').toLowerCase() !== activeCuisine) return false
    }

    return true
  })
}

// ── Sort ──────────────────────────────────────────────────────────────────────

/**
 * Sort a recipe list by the given sort key.
 * Returns a **new array** — the original is not mutated.
 *
 * @param {object[]} recipes
 * @param {'newest'|'oldest'|'az'|'za'|'quickest'} sortKey
 * @returns {object[]}
 */
export function sortRecipes(recipes, sortKey = 'newest') {
  const copy = [...recipes]

  switch (sortKey) {
    case 'oldest':
      return copy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    case 'az':
      return copy.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))

    case 'za':
      return copy.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''))

    case 'quickest': {
      const totalTime = (r) => (r.prep_time_min ?? 0) + (r.cook_time_min ?? 0)
      // Recipes with no time set (0) sort to the end
      return copy.sort((a, b) => {
        const ta = totalTime(a)
        const tb = totalTime(b)
        if (ta === 0 && tb === 0) return 0
        if (ta === 0) return 1
        if (tb === 0) return -1
        return ta - tb
      })
    }

    case 'newest':
    default:
      return copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

// ── Pagination ────────────────────────────────────────────────────────────────

/**
 * Slice a recipe list to a single page.
 *
 * @param {object[]} recipes - The full (already filtered + sorted) list
 * @param {number}   page     - 1-based current page number
 * @param {number}   pageSize - Items per page
 * @returns {{ items: object[], totalPages: number, currentPage: number }}
 */
export function paginateRecipes(recipes, page = 1, pageSize = 12) {
  const totalPages  = Math.max(1, Math.ceil(recipes.length / pageSize))
  // Clamp page to valid range in case URL param is out of bounds
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start       = (currentPage - 1) * pageSize
  const items       = recipes.slice(start, start + pageSize)

  return { items, totalPages, currentPage }
}
