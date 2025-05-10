/**
 * @fileoverview JSDoc typedefs for the Recipe domain entity.
 *
 * Import this file with a side-effect-free JSDoc reference tag in any
 * file that needs Recipe typing:
 *
 *   @typedef {import('./types/recipe.types').Recipe} Recipe
 *
 * When the project migrates to TypeScript, replace this file with
 * recipe.types.ts and update imports throughout.
 */

/**
 * @typedef {Object} Recipe
 * @property {string}      id            - UUID primary key
 * @property {string}      user_id       - UUID of the owning user
 * @property {string}      title         - Recipe title (max 120 chars)
 * @property {string|null} description   - Short summary of the dish
 * @property {string}      ingredients   - Free-text ingredient list
 * @property {string}      steps         - Free-text method / steps
 * @property {string|null} image_url     - Public image URL (max 500 chars)
 * @property {string[]}    tags          - Array of lowercase tag strings
 * @property {string|null} cuisine       - Cuisine label (e.g. "Italian")
 * @property {number|null} prep_time_min - Prep time in whole minutes
 * @property {number|null} cook_time_min - Cook time in whole minutes
 * @property {number|null} servings      - Serving count
 * @property {string}      created_at    - ISO 8601 timestamp
 * @property {string}      updated_at    - ISO 8601 timestamp
 */

/**
 * @typedef {Object} RecipeFormData
 * Subset of Recipe accepted by createRecipe / updateRecipe.
 * @property {string}      title
 * @property {string|null} description
 * @property {string}      ingredients
 * @property {string}      steps
 * @property {string|null} image_url
 * @property {string[]}    tags
 * @property {string|null} cuisine
 * @property {number|null} prep_time_min
 * @property {number|null} cook_time_min
 * @property {number|null} servings
 */
