import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../../auth'
import { useRecipes } from '../hooks/useRecipes'
import { ROUTES } from '../../../config/routes'
import { ConfirmDialog, Button, ErrorMessage } from '../../../shared/components'

/**
 * RecipeDetailPage — full view of a single recipe.
 *
 * Actions:
 *  - Edit: navigates to /recipes/:id/edit
 *  - Delete: opens ConfirmDialog; on confirmation calls deleteRecipe then
 *    navigates back to /recipes
 */
export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { recipe, loading, error, fetchRecipe, deleteRecipe } = useRecipes()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchRecipe(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    const ok = await deleteRecipe(id)
    setDeleting(false)
    setConfirmOpen(false)
    if (ok) navigate(ROUTES.RECIPES)
  }

  // ── Loading — skeleton matching the detail layout width ───────────
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-1 gap-4">
          {/* Hero image placeholder */}
          <div className="aspect-[16/5] w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-700" />
          {/* Title placeholder */}
          <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          {/* Meta row */}
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            ))}
          </div>
          {/* Body blocks */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" style={{ width: `${70 + i * 5}%` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── Error / not found ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <ErrorMessage message={error} />
        <div className="mt-4">
          <Link to={ROUTES.RECIPES} className="text-sm text-primary-600 hover:underline dark:text-primary-400">
            ← Back to recipes
          </Link>
        </div>
      </div>
    )
  }

  if (!recipe) return null

  const {
    title,
    description,
    ingredients,
    steps,
    image_url,
    tags = [],
    cuisine,
    prep_time_min,
    cook_time_min,
    servings,
    created_at,
    user_id,
  } = recipe

  const totalTime = (prep_time_min ?? 0) + (cook_time_min ?? 0)
  const isOwner = user?.id === user_id

  return (
    <article className="mx-auto max-w-3xl">
      {/* ── Back link ─────────────────────────────────────────── */}
      <Link
        to={ROUTES.RECIPES}
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Recipes
      </Link>

      {/* ── Hero image ────────────────────────────────────────── */}
      {image_url && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={image_url}
            alt={title}
            className="h-72 w-full object-cover sm:h-96"
          />
        </div>
      )}

      {/* ── Title and actions ─────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          {title}
        </h1>

        {isOwner && (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.RECIPE_EDIT(id))}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* ── Meta bar ──────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        {cuisine && (
          <span>
            <span className="font-medium text-neutral-700 dark:text-neutral-200">Cuisine: </span>
            {cuisine}
          </span>
        )}
        {prep_time_min != null && (
          <span>
            <span className="font-medium text-neutral-700 dark:text-neutral-200">Prep: </span>
            {prep_time_min} min
          </span>
        )}
        {cook_time_min != null && (
          <span>
            <span className="font-medium text-neutral-700 dark:text-neutral-200">Cook: </span>
            {cook_time_min} min
          </span>
        )}
        {totalTime > 0 && (
          <span>
            <span className="font-medium text-neutral-700 dark:text-neutral-200">Total: </span>
            {totalTime} min
          </span>
        )}
        {servings != null && (
          <span>
            <span className="font-medium text-neutral-700 dark:text-neutral-200">Serves: </span>
            {servings}
          </span>
        )}
      </div>

      {/* ── Tags ──────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Description ───────────────────────────────────────── */}
      {description && (
        <p className="mb-8 text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      )}

      {/* ── Ingredients ───────────────────────────────────────── */}
      <section className="mb-8" aria-labelledby="ingredients-heading">
        <h2
          id="ingredients-heading"
          className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white"
        >
          Ingredients
        </h2>
        <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {ingredients}
          </pre>
        </div>
      </section>

      {/* ── Steps ─────────────────────────────────────────────── */}
      <section className="mb-8" aria-labelledby="steps-heading">
        <h2
          id="steps-heading"
          className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white"
        >
          Method
        </h2>
        <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {steps}
          </pre>
        </div>
      </section>

      {/* ── Timestamp ─────────────────────────────────────────── */}
      {created_at && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Added {new Date(created_at).toLocaleDateString()}
        </p>
      )}

      {/* ── Delete confirmation dialog ────────────────────────── */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete recipe?"
        message={`"${title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  )
}
