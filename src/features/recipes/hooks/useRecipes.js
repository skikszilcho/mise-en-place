import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  fetchRecipes as serviceFetchRecipes,
  fetchRecipe as serviceFetchRecipe,
  createRecipe as serviceCreateRecipe,
  updateRecipe as serviceUpdateRecipe,
  deleteRecipe as serviceDeleteRecipe,
} from '../services/recipeService'

/**
 * useRecipes — React adapter over the recipe service layer.
 *
 * Manages loading, error, and data state for all recipe operations.
 * Components call these hook functions; they never call the service
 * layer directly. Toast notifications for mutations fire here —
 * no toast logic lives in page components.
 *
 * @returns {{
 *   recipes: object[],
 *   recipe: object|null,
 *   loading: boolean,
 *   error: string|null,
 *   fetchRecipes: (userId: string) => Promise<void>,
 *   fetchRecipe: (id: string) => Promise<void>,
 *   createRecipe: (userId: string, data: object) => Promise<object|null>,
 *   updateRecipe: (id: string, data: object) => Promise<object|null>,
 *   deleteRecipe: (id: string) => Promise<boolean>,
 * }}
 */
export function useRecipes() {
  const [recipes, setRecipes] = useState([])
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ── Queries ────────────────────────────────────────────────────────

  /**
   * Load all recipes for a user into the `recipes` state.
   * @param {string} userId
   */
  const fetchRecipes = useCallback(async (userId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await serviceFetchRecipes(userId)
      setRecipes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Load a single recipe by ID into the `recipe` state.
   * @param {string} id
   */
  const fetchRecipe = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    setRecipe(null)
    try {
      const data = await serviceFetchRecipe(id)
      setRecipe(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Mutations ──────────────────────────────────────────────────────

  /**
   * Create a new recipe and prepend it to the local list.
   * @param {string} userId
   * @param {object} data
   * @returns {Promise<object|null>} The created recipe, or null on failure
   */
  const createRecipe = useCallback(async (userId, data) => {
    setLoading(true)
    setError(null)
    try {
      const created = await serviceCreateRecipe(userId, data)
      setRecipes((prev) => [created, ...prev])
      toast.success('Recipe saved!')
      return created
    } catch (err) {
      setError(err.message)
      toast.error('Failed to save recipe')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update an existing recipe and patch it in the local list.
   * @param {string} id
   * @param {object} data
   * @returns {Promise<object|null>} The updated recipe, or null on failure
   */
  const updateRecipe = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await serviceUpdateRecipe(id, data)
      setRecipes((prev) => prev.map((r) => (r.id === id ? updated : r)))
      setRecipe(updated)
      toast.success('Recipe updated!')
      return updated
    } catch (err) {
      setError(err.message)
      toast.error('Failed to update recipe')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Delete a recipe and remove it from the local list.
   * @param {string} id
   * @returns {Promise<boolean>} True on success, false on failure
   */
  const deleteRecipe = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await serviceDeleteRecipe(id)
      setRecipes((prev) => prev.filter((r) => r.id !== id))
      setRecipe(null)
      toast.success('Recipe deleted')
      return true
    } catch (err) {
      setError(err.message)
      toast.error('Failed to delete recipe')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    recipes,
    recipe,
    loading,
    error,
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  }
}
