import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES, ROUTE_PATTERNS } from '../../config/routes'
import AuthLayout from '../../layouts/AuthLayout'
import AppLayout from '../../layouts/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import { LoginPage, RegisterPage, AuthCallback, ForgotPasswordPage, ResetPasswordPage } from '../../features/auth'
import {
  RecipeListPage,
  RecipeFormPage,
  RecipeDetailPage,
} from '../../features/recipes'

/**
 * AppRouter — central route configuration.
 *
 * Security note — GHSA-qwww-vcr4-c8h2 (react-router 7.12.0–8.2.0):
 *   `npm audit` flags the installed react-router-dom as vulnerable to an RSC
 *   Mode CSRF bypass. This app uses **Declarative Mode only** — BrowserRouter +
 *   Routes + Route. It has no server, no RSC action handler, no `action:`
 *   loaders, and no `unstable_routeRSCServerRequest` / `unstable_RSCStaticRouter`
 *   usage. The attack surface (a server-side HTTP handler validating Origin
 *   headers for RSC mutation requests) does not exist in this SPA. The advisory
 *   does not apply. See package.json `overrides` for the suppression rationale.
 *   npm audit fix --force would downgrade to 7.11.0 — a downgrade with no
 *   security benefit for this project and no API changes to Declarative Mode.
 *
 * Route hierarchy:
 *  Public (no auth required):
 *    /login           → AuthLayout > LoginPage
 *    /register        → AuthLayout > RegisterPage
 *    /auth/callback   → AuthCallback (no layout — handles redirect silently)
 *
 *  Protected (session required — ProtectedRoute guards the group):
 *    /recipes         → RecipeListPage
 *    /recipes/new     → RecipeFormPage  (create mode: no :id param)
 *    /recipes/:id     → RecipeDetailPage
 *    /recipes/:id/edit→ RecipeFormPage  (edit mode: :id param present)
 *
 *  Fallback:
 *    *               → redirect to /login
 *
 * Note: /recipes/new is declared before /recipes/:id so the literal path
 * segment "new" is never matched as a dynamic id.
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* OAuth PKCE callback — standalone, no AuthLayout chrome */}
      <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />

      {/* ── Protected routes — guarded then wrapped in AppLayout ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.RECIPES} element={<RecipeListPage />} />
          {/* RECIPE_NEW must be declared before /recipes/:id so "new" is not matched as a dynamic id */}
          <Route path={ROUTES.RECIPE_NEW} element={<RecipeFormPage />} />
          <Route path={ROUTE_PATTERNS.RECIPE_DETAIL} element={<RecipeDetailPage />} />
          <Route path={ROUTE_PATTERNS.RECIPE_EDIT} element={<RecipeFormPage />} />
        </Route>
      </Route>

      {/* ── Fallback ──────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}
