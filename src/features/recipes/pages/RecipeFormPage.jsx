import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth'
import { useRecipes } from '../hooks/useRecipes'
import { validateRecipe, parseTagString, tagsToString } from '../utils/recipeValidation'
import { ROUTES } from '../../../config/routes'
import { Input, Button, ErrorMessage } from '../../../shared/components'

/** Blank slate for the controlled form */
const EMPTY_FORM = {
  title: '',
  description: '',
  ingredients: '',
  steps: '',
  image_url: '',
  tags: '',
  cuisine: '',
  prep_time_min: '',
  cook_time_min: '',
  servings: '',
}

/**
 * RecipeFormPage — shared create and edit form.
 *
 * Mode detection: if `useParams().id` resolves, the page is in edit mode
 * and pre-populates the form from the fetched recipe. Otherwise it is in
 * create mode with a blank form.
 *
 * On submit:
 *  1. Runs validateRecipe — shows per-field errors on failure
 *  2. Calls createRecipe or updateRecipe via the useRecipes hook
 *  3. On success, navigates to the recipe detail page
 */
export default function RecipeFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { recipe, loading, error, fetchRecipe, createRecipe, updateRecipe } = useRecipes()

  const [fields, setFields] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})

  // ── Edit mode: load the recipe and populate the form ─────────────
  useEffect(() => {
    if (isEdit) fetchRecipe(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (isEdit && recipe) {
      setFields({
        title: recipe.title ?? '',
        description: recipe.description ?? '',
        ingredients: recipe.ingredients ?? '',
        steps: recipe.steps ?? '',
        image_url: recipe.image_url ?? '',
        tags: tagsToString(recipe.tags ?? []),
        cuisine: recipe.cuisine ?? '',
        prep_time_min: recipe.prep_time_min?.toString() ?? '',
        cook_time_min: recipe.cook_time_min?.toString() ?? '',
        servings: recipe.servings?.toString() ?? '',
      })
    }
  }, [isEdit, recipe])

  // ── Controlled field handler ──────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    // Clear per-field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // ── Submit ────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    setFieldErrors({})

    // Build the data object — coerce numeric fields
    const data = {
      title: fields.title.trim(),
      description: fields.description.trim() || null,
      ingredients: fields.ingredients.trim(),
      steps: fields.steps.trim(),
      image_url: fields.image_url.trim() || null,
      tags: parseTagString(fields.tags),
      cuisine: fields.cuisine.trim() || null,
      prep_time_min: fields.prep_time_min !== '' ? Number(fields.prep_time_min) : null,
      cook_time_min: fields.cook_time_min !== '' ? Number(fields.cook_time_min) : null,
      servings: fields.servings !== '' ? Number(fields.servings) : null,
    }

    const { valid, errors } = validateRecipe(data)
    if (!valid) {
      setFieldErrors(errors)
      return
    }

    let result
    if (isEdit) {
      result = await updateRecipe(id, data)
    } else {
      result = await createRecipe(user.id, data)
    }

    if (result) {
      navigate(ROUTES.RECIPE_DETAIL(result.id))
    }
  }

  // ── Loading skeleton while fetching for edit ──────────────────────
  if (isEdit && loading && !recipe) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900 dark:text-white">
        {isEdit ? 'Edit Recipe' : 'New Recipe'}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* ── Required fields ──────────────────────────────────── */}
        <Input
          label="Title *"
          id="title"
          name="title"
          value={fields.title}
          onChange={handleChange}
          error={fieldErrors.title}
          placeholder="e.g. Classic Beef Bolognese"
          maxLength={120}
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={fields.description}
            onChange={handleChange}
            placeholder="A short summary of the dish…"
            className="block w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="ingredients"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            Ingredients *
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            rows={6}
            value={fields.ingredients}
            onChange={handleChange}
            placeholder="List each ingredient on its own line…"
            aria-invalid={!!fieldErrors.ingredients}
            aria-describedby={fieldErrors.ingredients ? 'ingredients-error' : undefined}
            className={`block w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 ${
              fieldErrors.ingredients
                ? 'border-error-500 focus-visible:ring-error-500'
                : 'border-neutral-300 focus-visible:ring-primary-500 dark:border-neutral-600'
            }`}
          />
          {fieldErrors.ingredients && (
            <p id="ingredients-error" role="alert" className="text-xs text-error-600 dark:text-error-400">
              {fieldErrors.ingredients}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="steps"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            Steps *
          </label>
          <textarea
            id="steps"
            name="steps"
            rows={8}
            value={fields.steps}
            onChange={handleChange}
            placeholder="Describe each step…"
            aria-invalid={!!fieldErrors.steps}
            aria-describedby={fieldErrors.steps ? 'steps-error' : undefined}
            className={`block w-full rounded-lg border px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 ${
              fieldErrors.steps
                ? 'border-error-500 focus-visible:ring-error-500'
                : 'border-neutral-300 focus-visible:ring-primary-500 dark:border-neutral-600'
            }`}
          />
          {fieldErrors.steps && (
            <p id="steps-error" role="alert" className="text-xs text-error-600 dark:text-error-400">
              {fieldErrors.steps}
            </p>
          )}
        </div>

        {/* ── Optional fields ───────────────────────────────────── */}
        <Input
          label="Image URL"
          id="image_url"
          name="image_url"
          type="url"
          value={fields.image_url}
          onChange={handleChange}
          error={fieldErrors.image_url}
          placeholder="https://example.com/photo.jpg"
        />

        <Input
          label="Tags (comma-separated)"
          id="tags"
          name="tags"
          value={fields.tags}
          onChange={handleChange}
          error={fieldErrors.tags}
          placeholder="e.g. italian, pasta, weeknight"
          helpText="Up to 10 tags, each up to 30 characters"
        />

        <Input
          label="Cuisine"
          id="cuisine"
          name="cuisine"
          value={fields.cuisine}
          onChange={handleChange}
          placeholder="e.g. Italian"
        />

        {/* ── Numeric row ───────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Prep time (min)"
            id="prep_time_min"
            name="prep_time_min"
            type="number"
            min="1"
            value={fields.prep_time_min}
            onChange={handleChange}
            error={fieldErrors.prep_time_min}
            placeholder="15"
          />
          <Input
            label="Cook time (min)"
            id="cook_time_min"
            name="cook_time_min"
            type="number"
            min="1"
            value={fields.cook_time_min}
            onChange={handleChange}
            error={fieldErrors.cook_time_min}
            placeholder="30"
          />
          <Input
            label="Servings"
            id="servings"
            name="servings"
            type="number"
            min="1"
            value={fields.servings}
            onChange={handleChange}
            error={fieldErrors.servings}
            placeholder="4"
          />
        </div>

        {/* ── Form-level service error (distinct from field errors) */}
        {error && <ErrorMessage message={error} />}

        {/* ── Actions ───────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(isEdit ? ROUTES.RECIPE_DETAIL(id) : ROUTES.RECIPES)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </div>
  )
}
