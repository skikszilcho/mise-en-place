import { createContext } from 'react'

/**
 * @typedef {Object} AuthContextValue
 * @property {import('@supabase/supabase-js').User | null} user
 * @property {import('@supabase/supabase-js').Session | null} session
 * @property {boolean} loading
 * @property {() => Promise<void>} signOut
 */

/** @type {import('react').Context<AuthContextValue | null>} */
export const AuthContext = createContext(null)
