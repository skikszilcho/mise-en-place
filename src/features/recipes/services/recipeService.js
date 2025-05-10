import { supabase } from '../../../services/supabase/supabaseClient'
import { logger } from '../../../shared/utils/logger'
import { withErrorHandling } from '../../../shared/utils/withErrorHandling'

/**
 * recipeService — the single point of contact between the application
 * and Supabase for all recipe data operations.
 *
 * Architectural principle: React components never call supabase.from('recipes')
 * directly. They call these service functions. This means:
 *   - Business logic is testable independently of the UI
 *   - Phase 2 normalisation (recipe_ingredients, recipe_steps joins) happens
 *     here, not in components
 *   - Supabase can be swapped for another backend without touching components
 *
 * Note: RLS already enforces per-user access at the database level.
 * The explicit .eq('user_id', userId) filter in fetchRecipes is a defensive
 * complement — belt-and-suspenders, not a replacement for RLS.
 */

/**
 * Fetch all recipes belonging to a user, newest first.
 *
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function fetchRecipes(userId) {
  return withErrorHandling(
    async () => {
      const start = performance.now()

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      logger.debug('Query timing', {
        operation: 'fetchRecipes',
        durationMs: Math.round(performance.now() - start),
      })

      if (error) throw error
      return data
    },
    { operation: 'fetchRecipes', table: 'recipes', userId },
  )
}

/**
 * Fetch a single recipe by its primary key.
 *
 * @param {string} id - Recipe UUID
 * @returns {Promise<object>}
 */
export async function fetchRecipe(id) {
  return withErrorHandling(
    async () => {
      const start = performance.now()

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      logger.debug('Query timing', {
        operation: 'fetchRecipe',
        durationMs: Math.round(performance.now() - start),
      })

      if (error) throw error
      return data
    },
    { operation: 'fetchRecipe', table: 'recipes' },
  )
}

/**
 * Create a new recipe.
 *
 * @param {string} userId
 * @param {{
 *   title: string,
 *   description?: string,
 *   ingredients: string,
 *   steps: string,
 *   image_url?: string,
 *   tags?: string[],
 *   cuisine?: string,
 *   prep_time_min?: number,
 *   cook_time_min?: number,
 *   servings?: number,
 * }} data
 * @returns {Promise<object>} The newly created recipe row
 */
export async function createRecipe(userId, data) {
  return withErrorHandling(
    async () => {
      const start = performance.now()

      const { data: created, error } = await supabase
        .from('recipes')
        .insert({ ...data, user_id: userId })
        .select()
        .single()

      logger.debug('Query timing', {
        operation: 'createRecipe',
        durationMs: Math.round(performance.now() - start),
      })

      if (error) throw error
      return created
    },
    { operation: 'createRecipe', table: 'recipes', userId },
  )
}

/**
 * Update an existing recipe. Sets updated_at to now() explicitly.
 *
 * @param {string} id - Recipe UUID
 * @param {Partial<object>} data - Fields to update (user_id is excluded)
 * @returns {Promise<object>} The updated recipe row
 */
export async function updateRecipe(id, data) {
  return withErrorHandling(
    async () => {
      // Explicitly strip user_id — it must never change after creation.
      // eslint-disable-next-line no-unused-vars
      const { user_id, ...safeData } = data

      const start = performance.now()

      const { data: updated, error } = await supabase
        .from('recipes')
        .update({ ...safeData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      logger.debug('Query timing', {
        operation: 'updateRecipe',
        durationMs: Math.round(performance.now() - start),
      })

      if (error) throw error
      return updated
    },
    { operation: 'updateRecipe', table: 'recipes' },
  )
}

/**
 * Delete a recipe by its primary key.
 * RLS ensures only the owning user can delete.
 *
 * @param {string} id - Recipe UUID
 * @returns {Promise<void>}
 */
export async function deleteRecipe(id) {
  return withErrorHandling(
    async () => {
      const start = performance.now()

      const { error } = await supabase.from('recipes').delete().eq('id', id)

      logger.debug('Query timing', {
        operation: 'deleteRecipe',
        durationMs: Math.round(performance.now() - start),
      })

      if (error) throw error
    },
    { operation: 'deleteRecipe', table: 'recipes' },
  )
}
