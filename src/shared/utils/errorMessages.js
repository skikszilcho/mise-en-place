/**
 * errorMessages — maps known Supabase / Supabase Auth error codes to plain-English
 * user-facing strings.
 *
 * Supabase errors come back as objects with at minimum a `message` field.
 * Auth errors additionally carry a `code` field (e.g. "invalid_credentials").
 * PostgREST errors carry a `code` field following the PostgreSQL SQLSTATE scheme.
 *
 * Mapping strategy:
 *   1. Check error.code first (most specific).
 *   2. Fall back to error.message as-is if the code is unrecognised.
 *   3. Return a generic fallback if neither is available.
 */

/** @type {Record<string, string>} */
const CODE_MAP = {
  // ── Supabase Auth codes ────────────────────────────────────────────────────
  invalid_credentials:
    'The email address or password you entered is incorrect.',
  email_not_confirmed:
    'Please confirm your email address before signing in. Check your inbox.',
  user_already_exists:
    'An account with this email address already exists. Try signing in instead.',
  over_email_send_rate_limit:
    'Too many emails sent recently. Please wait a moment before trying again.',
  user_not_found:
    'No account found with that email address.',
  weak_password:
    'Your password is too weak. Please choose a stronger password.',
  email_address_invalid:
    'Please enter a valid email address.',
  session_not_found:
    'Your session has expired. Please sign in again.',
  flow_state_expired:
    'Your sign-in link has expired. Please request a new one.',
  otp_expired:
    'The confirmation link has expired. Please request a new one.',
  same_password:
    'Your new password must be different from your current password.',

  // ── PostgREST / PostgreSQL SQLSTATE codes ──────────────────────────────────
  PGRST116: 'The requested record was not found.',
  '23505': 'This record already exists.',
  '42501': 'You do not have permission to perform this action.',
  '23503': 'This action references a record that no longer exists.',
}

/**
 * Returns a user-friendly message for a given Supabase or Auth error.
 *
 * @param {import('@supabase/supabase-js').AuthError | import('@supabase/supabase-js').PostgrestError | Error | null | undefined} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.'

  const code = /** @type {any} */ (error).code
  if (code && CODE_MAP[code]) return CODE_MAP[code]

  if (error.message) return error.message

  return 'An unexpected error occurred. Please try again.'
}
