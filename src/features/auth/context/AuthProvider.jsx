import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import {
  getSession,
  onAuthStateChange,
  signOut as signOutRequest,
} from '../services/authService'

/**
 * AuthProvider — wraps the application and makes auth state available
 * to any component via the useAuth hook. Initialises from the existing
 * session on mount and subscribes to auth state changes reactively.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  // loading stays true until the initial getSession() call resolves,
  // preventing ProtectedRoute from flashing /login on a page refresh.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Hydrate from any existing persisted session
    getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 2. Subscribe to all future auth state changes (login, logout,
    //    token refresh, OAuth callback) for the lifetime of the app.
    const {
      data: { subscription },
    } = onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Once onAuthStateChange fires we know the initial state is set.
      setLoading(false)
    })

    // 3. Unsubscribe when the provider unmounts (prevents memory leaks).
    return () => subscription.unsubscribe()
  }, [])

  /**
   * Signs the current user out and clears local session state.
   * @returns {Promise<void>}
   */
  async function signOut() {
    await signOutRequest()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
