import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * useAuth — access authentication state from any component.
 *
 * @returns {import('./AuthContext').AuthContextValue}
 * @throws If used outside of an AuthProvider
 *
 * @example
 * const { user, signOut, loading } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
