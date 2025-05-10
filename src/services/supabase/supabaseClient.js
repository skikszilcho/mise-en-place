import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../config/env'

/**
 * Supabase client instance.
 *
 * Connection details are sourced exclusively from src/config/env.js,
 * which validates that both required variables are present at module
 * load time. This file never reads import.meta.env directly.
 *
 * The `anon` key is intentionally public — it identifies the project
 * but grants no access beyond what Row Level Security policies permit.
 * Never use the `service_role` key here.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'pkce',
  },
})
