import {
  MAX_TITLE_LENGTH,
  MAX_TAG_LENGTH,
  MAX_TAGS_PER_RECIPE,
  MAX_IMAGE_URL_LENGTH,
} from '../../../config/constants'

/**
 * recipeValidation — pure validation functions for recipe data.
 *
 * No React imports. No Supabase imports. These functions can be
 * unit-tested in isolation with no environment setup.
 *
 * Validation strategy:
 *  - Client-side: runs before submission, gives immediate feedback
 *  - Server-side: Supabase NOT NULL / CHECK constraints act as safety net
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - True when there are no errors
 * @property {Record<string, string>} errors - Map of field name → error message
 */

/**
 * Validate a recipe form submission.
 *
 * @param {{
 *   title?: string,
 *   ingredients?: string,
 *   steps?: string,
 *   image_url?: string,
 *   tags?: string[],
 *   prep_time_min?: number|string,
 *   cook_time_min?: number|string,
 *   servings?: number|string,
 * }} data
 * @returns {ValidationResult}
 */
export function validateRecipe(data) {
  const errors = {}

  // ── Required fields ──────────────────────────────────────────────
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.trim().length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer`
  }

  if (!data.ingredients || !data.ingredients.trim()) {
    errors.ingredients = 'Ingredients are required'
  }

  if (!data.steps || !data.steps.trim()) {
    errors.steps = 'Steps are required'
  }

  // ── Optional numeric fields ───────────────────────────────────────
  if (data.prep_time_min !== '' && data.prep_time_min !== null && data.prep_time_min !== undefined) {
    const val = Number(data.prep_time_min)
    if (!Number.isInteger(val) || val <= 0) {
      errors.prep_time_min = 'Prep time must be a whole number greater than 0'
    }
  }

  if (data.cook_time_min !== '' && data.cook_time_min !== null && data.cook_time_min !== undefined) {
    const val = Number(data.cook_time_min)
    if (!Number.isInteger(val) || val <= 0) {
      errors.cook_time_min = 'Cook time must be a whole number greater than 0'
    }
  }

  if (data.servings !== '' && data.servings !== null && data.servings !== undefined) {
    const val = Number(data.servings)
    if (!Number.isInteger(val) || val <= 0) {
      errors.servings = 'Servings must be a whole number greater than 0'
    }
  }

  // ── Optional string fields ────────────────────────────────────────
  if (data.image_url && data.image_url.trim().length > MAX_IMAGE_URL_LENGTH) {
    errors.image_url = `Image URL must be ${MAX_IMAGE_URL_LENGTH} characters or fewer`
  }

  // ── Tags ──────────────────────────────────────────────────────────
  if (Array.isArray(data.tags)) {
    if (data.tags.length > MAX_TAGS_PER_RECIPE) {
      errors.tags = `Maximum ${MAX_TAGS_PER_RECIPE} tags allowed`
    } else {
      const longTag = data.tags.find((t) => t.length > MAX_TAG_LENGTH)
      if (longTag) {
        errors.tags = `Each tag must be ${MAX_TAG_LENGTH} characters or fewer`
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Parse a comma-separated tag string into a clean array.
 * Trims whitespace, lowercases, and removes empty entries.
 *
 * @param {string} tagString - e.g. "Italian, Quick, Weeknight"
 * @returns {string[]} - e.g. ["italian", "quick", "weeknight"]
 */
export function parseTagString(tagString) {
  if (!tagString || !tagString.trim()) return []
  return tagString
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Serialise a tags array back to a comma-separated string for display
 * in the form input.
 *
 * @param {string[]} tags
 * @returns {string}
 */
export function tagsToString(tags) {
  if (!Array.isArray(tags)) return ''
  return tags.join(', ')
}
