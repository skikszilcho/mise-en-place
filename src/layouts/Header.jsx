import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { DARK_MODE_STORAGE_KEY } from '../config/constants'
import { ROUTES } from '../config/routes'

/**
 * Header — authenticated app chrome: logo, nav, avatar menu, dark mode toggle.
 *
 * Layout:
 *  Desktop (sm+): logo left | nav centre | dark-toggle + avatar right
 *  Mobile: logo left | hamburger right; nav collapses into a dropdown panel
 *
 * Dark mode:
 *  Reads / writes the `dark` class on <html> directly and persists to
 *  localStorage. The initial value is seeded by main.jsx before first render
 *  so there is never a flash of the wrong theme.
 *
 * Accessibility:
 *  - hamburger button: aria-expanded + aria-controls
 *  - mobile nav panel: id matching aria-controls
 *  - avatar dropdown: aria-expanded + aria-haspopup
 *  - active nav links: aria-current="page" (via NavLink)
 *  - Escape key closes both menus
 */
export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )

  const avatarRef = useRef(null)
  const avatarMenuRef = useRef(null)

  // ── Dark mode toggle ─────────────────────────────────────────────
  function toggleDark() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(next))
  }

  // ── Close menus on Escape ────────────────────────────────────────
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setAvatarOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // ── Close avatar dropdown on outside click ───────────────────────
  useEffect(() => {
    if (!avatarOpen) return
    function handleClick(e) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(e.target) &&
        !avatarRef.current.contains(e.target)
      ) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [avatarOpen])

  async function handleSignOut() {
    setAvatarOpen(false)
    setMobileOpen(false)
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  // First letter of email for avatar initials
  const initial = user?.email?.[0]?.toUpperCase() ?? '?'

  // Shared active/inactive class builder for NavLinks
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-sm font-semibold text-primary-700 dark:text-primary-400'
      : 'text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors'

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* ── Logo ──────────────────────────────────────────────── */}
        <Link
          to={ROUTES.RECIPES}
          className="text-base font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          Mise en Place
        </Link>

        {/* ── Desktop nav (hidden on mobile) ───────────────────── */}
        <nav className="hidden items-center gap-6 sm:flex" aria-label="Main navigation">
          <NavLink to={ROUTES.RECIPES} end className={navLinkClass}>
            Recipes
          </NavLink>
          <NavLink to={ROUTES.RECIPE_NEW} className={navLinkClass}>
            + Add Recipe
          </NavLink>
        </nav>

        {/* ── Right side: dark toggle + avatar ─────────────────── */}
        <div className="flex items-center gap-2">

          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            {isDark ? (
              /* Sun icon */
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" />
              </svg>
            ) : (
              /* Moon icon */
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 12c0 5.385 4.365 9.75 9.75 9.75 4.426 0 8.186-2.944 9.502-7.002-.5.077-.998.115-1.5.117z" />
              </svg>
            )}
          </button>

          {/* Avatar / user menu (desktop) */}
          <div className="relative hidden sm:block">
            <button
              ref={avatarRef}
              type="button"
              onClick={() => setAvatarOpen((o) => !o)}
              aria-expanded={avatarOpen}
              aria-haspopup="menu"
              aria-label="User menu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {initial}
            </button>

            {avatarOpen && (
              <div
                ref={avatarMenuRef}
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white py-1 shadow-lg ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700"
              >
                {/* Email display */}
                <div className="border-b border-neutral-100 px-4 py-2 dark:border-neutral-700">
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {user?.email}
                  </p>
                </div>
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:hidden dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {mobileOpen ? (
              /* X icon */
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile nav panel ──────────────────────────────────────── */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-neutral-200 bg-white px-4 pb-4 pt-2 dark:border-neutral-700 dark:bg-neutral-900 sm:hidden"
        >
          <NavLink
            to={ROUTES.RECIPES}
            end
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            Recipes
          </NavLink>
          <NavLink
            to={ROUTES.RECIPE_NEW}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            + Add Recipe
          </NavLink>

          {/* Divider */}
          <div className="my-2 border-t border-neutral-100 dark:border-neutral-700" />

          {/* User email */}
          <p className="px-3 py-1 text-xs text-neutral-400 dark:text-neutral-500">
            {user?.email}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </nav>
      )}
    </header>
  )
}
