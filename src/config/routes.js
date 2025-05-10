/**
 * routes.js — centralised route path constants.
 *
 * Architectural rule: no component, hook, or service ever hard-codes a path
 * string. All navigation and <Link to="..."> values use ROUTES.* instead.
 * This means:
 *   - Renaming or restructuring a route requires a single-file change
 *   - Typos in path strings are caught at the import site, not at runtime
 *   - The full route map of the application is visible in one place
 *
 * Dynamic routes are expressed as functions that accept the required
 * parameter(s) and return the resolved path string.
 */
export const ROUTES = {
  /** Public routes — no authentication required */
  LOGIN:         '/login',
  REGISTER:      '/register',
  AUTH_CALLBACK: '/auth/callback',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  /** Protected routes — session required */
  RECIPES:       '/recipes',
  RECIPE_NEW:    '/recipes/new',

  /**
   * Recipe detail page.
   * @param {string} id - Recipe UUID
   * @returns {string}
   */
  RECIPE_DETAIL: (id) => `/recipes/${id}`,

  /**
   * Recipe edit page.
   * @param {string} id - Recipe UUID
   * @returns {string}
   */
  RECIPE_EDIT:   (id) => `/recipes/${id}/edit`,
}

/**
 * ROUTE_PATTERNS — static path patterns for use in <Route path="..."> definitions.
 * These match the dynamic segments React Router needs for route registration.
 * Use ROUTES.RECIPE_DETAIL(id) / ROUTES.RECIPE_EDIT(id) for navigation.
 */
export const ROUTE_PATTERNS = {
  RECIPE_DETAIL: '/recipes/:id',
  RECIPE_EDIT:   '/recipes/:id/edit',
}
