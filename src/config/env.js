/**
 * env.js — the single, validated gateway to all environment variables.
 *
 * Architectural rule: this is the ONLY file in the codebase that reads
 * `import.meta.env`. Every other file that needs an env value imports it
 * from here. This means:
 *   - The full list of required variables is visible in one place
 *   - Missing variables fail loudly at module load time with a clear message
 *   - The app never silently starts in a half-configured state
 *
 * Vite replaces all `import.meta.env.*` references with their literal values
 * at build time. Anything not prefixed with `VITE_` is inaccessible here
 * by design — the `service_role` key must never appear in browser code.
 */

/**
 * Validate that a required environment variable is present and non-empty.
 *
 * @param {string} name - The environment variable name (e.g. 'VITE_SUPABASE_URL')
 * @param {string | undefined} value - The value read from import.meta.env
 * @returns {string} The validated value
 * @throws {Error} If the value is missing or empty
 */
function requireEnv(name, value) {
  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${name} — check .env.local\n` +
      `Copy .env.example to .env.local and fill in all required values.`
    )
  }
  return value.trim()
}

export const SUPABASE_URL = requireEnv(
  'VITE_SUPABASE_URL',
  import.meta.env.VITE_SUPABASE_URL
)

export const SUPABASE_ANON_KEY = requireEnv(
  'VITE_SUPABASE_ANON_KEY',
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
