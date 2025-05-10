/**
 * constants.js — single source of truth for all magic numbers,
 * limits, and app-wide string literals.
 *
 * Architectural rule: never repeat a numeric or string literal that has
 * semantic meaning across more than one file. Import from here instead.
 * When a value needs to change, it changes in exactly one place.
 */

// ── Password field limits ───────────────────────────────────────────────────────

/** Minimum characters allowed for password. */
export const MIN_PASSWORD_LENGTH = 8
/** Maximum characters allowed for password. */
export const MAX_PASSWORD_LENGTH = 128

// ── Search & pagination ───────────────────────────────────────────────────────

/** Milliseconds to wait after the last keystroke before firing a search.
 *  Used by SearchBar and anywhere else debouncing is needed. */
export const SEARCH_DEBOUNCE_MS = 200

/** Number of recipe cards shown per page on the list view. */
export const RECIPES_PAGE_SIZE = 12

// ── Recipe field limits ───────────────────────────────────────────────────────

/** Maximum characters allowed for a recipe title. */
export const MAX_TITLE_LENGTH = 120

/** Maximum characters allowed for a single tag string. */
export const MAX_TAG_LENGTH = 30

/** Maximum number of tags allowed on a single recipe. */
export const MAX_TAGS_PER_RECIPE = 10

/** Maximum characters allowed for the image_url field. */
export const MAX_IMAGE_URL_LENGTH = 500

// ── Storage keys ─────────────────────────────────────────────────────────────

/** localStorage key used to persist the user's dark mode preference.
 *  Must match the key used in main.jsx (read before first render). */
export const DARK_MODE_STORAGE_KEY = 'mise-en-place-dark-mode'

// ── Logging ───────────────────────────────────────────────────────────────────

/** Prefix prepended to every structured log line. */
export const LOG_PREFIX = '[mise-en-place]'
