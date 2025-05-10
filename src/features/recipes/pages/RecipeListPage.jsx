import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { useRecipes } from '../hooks/useRecipes'
import { filterRecipes, sortRecipes, paginateRecipes } from '../utils/recipeFilters'
import { RECIPES_PAGE_SIZE } from '../../../config/constants'
import { ROUTES } from '../../../config/routes'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import SortDropdown from '../components/SortDropdown'
import TagFilterChips from '../components/TagFilterChips'
import Pagination from '../components/Pagination'
import { SkeletonCard, EmptyState, ErrorMessage } from '../../../shared/components'

/** Plate icon used in the empty state */
const PlateIcon = (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zM9 9h6v6H9V9z" />
  </svg>
)

/** Search/filter icon used in the "no results" empty state */
const SearchIcon = (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
)

/**
 * RecipeListPage — authenticated, filterable, sortable, paginated recipe grid.
 *
 * URL search params are the single source of truth for all filter/sort/page
 * state. This means:
 *  - Refreshing the page restores the exact same view
 *  - The browser back button steps through filter history
 *  - URLs are shareable and bookmarkable
 *
 * Derivation pipeline (all via useMemo — no redundant re-computation):
 *   raw recipes → filterRecipes → sortRecipes → paginateRecipes → render
 */
export default function RecipeListPage() {
  const { user } = useAuth()
  const { recipes, loading, error, fetchRecipes } = useRecipes()
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Read URL state ─────────────────────────────────────────────────────
  const query   = searchParams.get('q') ?? ''
  const sort    = searchParams.get('sort') ?? 'newest'
  // tags param is comma-separated: ?tags=italian,pasta
  const rawTags = searchParams.get('tags') ?? ''
  const activeTags = useMemo(
    () => (rawTags ? rawTags.split(',').filter(Boolean) : []),
    [rawTags]
  )
  const page    = parseInt(searchParams.get('page') ?? '1', 10)

  // ── Load recipes on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (user?.id) fetchRecipes(user.id)
  }, [user?.id, fetchRecipes])

  // ── Derived state — filter → sort → paginate ───────────────────────────
  const { items: visibleRecipes, totalPages, currentPage } = useMemo(() => {
    const filtered  = filterRecipes(recipes, { query, tags: activeTags })
    const sorted    = sortRecipes(filtered, sort)
    return paginateRecipes(sorted, page, RECIPES_PAGE_SIZE)
  }, [recipes, query, activeTags, sort, page])

  // ── URL param writers (each resets page to 1 except onPageChange) ──────
  function setQuery(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set('q', value); else next.delete('q')
      next.delete('page')
      return next
    })
  }

  function setSort(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value && value !== 'newest') next.set('sort', value); else next.delete('sort')
      next.delete('page')
      return next
    })
  }

  function setActiveTags(tags) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (tags.length > 0) next.set('tags', tags.join(',')); else next.delete('tags')
      next.delete('page')
      return next
    })
  }

  function setPage(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value > 1) next.set('page', String(value)); else next.delete('page')
      return next
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          My Recipes
        </h1>
      </div>

      {/* ── Filter / sort toolbar ────────────────────────────────── */}
      {/* Only show once recipes have loaded and there are some to filter */}
      {!loading && recipes.length > 0 && (
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <SearchBar value={query} onChange={setQuery} />
            </div>
            <div className="w-full sm:w-48">
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>
          <TagFilterChips
            recipes={recipes}
            activeTags={activeTags}
            onChange={setActiveTags}
          />
        </div>
      )}

      {/* ── Error state ──────────────────────────────────────────── */}
      {error && <ErrorMessage message={error} />}

      {/* ── Loading state — SkeletonCard grid ────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Empty collection (no recipes at all) ─────────────────── */}
      {!loading && !error && recipes.length === 0 && (
        <EmptyState
          icon={PlateIcon}
          heading="No recipes yet"
          body="Start building your collection"
          cta={{ label: 'Add your first recipe', to: ROUTES.RECIPE_NEW }}
        />
      )}

      {/* ── No filter results (recipes exist but none match) ─────── */}
      {!loading && recipes.length > 0 && visibleRecipes.length === 0 && (
        <EmptyState
          icon={SearchIcon}
          heading="No recipes match your filters"
          body={
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-primary-600 hover:underline dark:text-primary-400"
            >
              Clear all filters
            </button>
          }
        />
      )}

      {/* ── Recipe grid ──────────────────────────────────────────── */}
      {!loading && visibleRecipes.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* ── Pagination ──────────────────────────────────────── */}
          <div className="mt-8">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  )
}
