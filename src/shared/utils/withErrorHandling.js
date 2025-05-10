import { logger } from './logger'

/**
 * withErrorHandling — higher-order function that wraps an async service call
 * with structured error logging before re-throwing.
 *
 * This keeps individual service functions free of repetitive try/catch blocks
 * while ensuring every error is logged with its full operational context.
 *
 * @template T
 * @param {() => Promise<T>} fn - The async function to execute.
 * @param {{ operation: string, table: string, userId?: string }} context
 *   Contextual metadata captured in the error log.
 * @returns {Promise<T>}
 *
 * @example
 * return withErrorHandling(
 *   () => supabase.from('recipes').select('*'),
 *   { operation: 'fetchRecipes', table: 'recipes', userId }
 * )
 */
export async function withErrorHandling(fn, context) {
  try {
    return await fn()
  } catch (error) {
    logger.error('Service call failed', { ...context, error })
    throw error
  }
}
