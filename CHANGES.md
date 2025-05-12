# Mise en Place — Changes Log

This document records every meaningful change made **after the initial commit**. Each entry
is written when the change is committed — it is the permanent record of what was done, why,
and what files were affected.

---

## How to Read This File

Each entry follows this structure:

```
## [vX.Y] — Short description
**Commit type:** feat | fix | refactor | docs | chore | style
**Files changed:** list of affected files
**What changed:** description of what was added, modified, or removed
**Why:** the reason this change was made
```

---

## Changes

### [v1.1] — Shared component library and utility layer

**Commit type:** `feat`

**Files changed:**
- `src/shared/components/Button.jsx` — added variant and size props
- `src/shared/components/Input.jsx` — added error state styling
- `src/shared/components/ConfirmDialog.jsx` — added to shared library
- `src/shared/components/SkeletonCard.jsx` — loading placeholder component
- `src/shared/components/Spinner.jsx` — inline spinner for async states
- `src/shared/components/EmptyState.jsx` — empty collection display
- `src/shared/components/ErrorMessage.jsx` — inline error display
- `src/shared/components/FormError.jsx` — form field error helper
- `src/shared/components/ErrorBoundary.jsx` — React error boundary
- `src/shared/components/index.js` — barrel export for all shared components
- `src/shared/utils/errorMessages.js` — standardised user-facing error strings
- `src/shared/utils/logger.js` — structured logging wrapper
- `src/shared/utils/withErrorHandling.js` — higher-order function for async error handling
- `src/shared/utils/index.js` — barrel export for shared utilities

**What changed:** The full shared component and utility layer was built out.
`Button` and `Input` gained controlled props for error states. `ConfirmDialog` was added
as a reusable modal for destructive action confirmations. Loading and empty states were
componentised so every feature uses the same visual language.

**Why:** Prevents duplicated loading spinners, inconsistent error displays, and one-off
button styles across recipe and auth features. Shared primitives that two or more features
consume belong in `src/shared/`, not duplicated in each feature folder.

---

### [v1.2] — Auth feature: registration, login, and password reset

**Commit type:** `feat`

**Files changed:**
- `src/features/auth/context/AuthContext.js`
- `src/features/auth/context/AuthProvider.jsx`
- `src/features/auth/hooks/useAuth.js`
- `src/features/auth/hooks/index.js`
- `src/features/auth/services/authService.js`
- `src/features/auth/pages/LoginPage.jsx`
- `src/features/auth/pages/RegisterPage.jsx`
- `src/features/auth/pages/ForgotPasswordPage.jsx`
- `src/features/auth/pages/ResetPasswordPage.jsx`
- `src/features/auth/pages/AuthCallback.jsx`
- `src/features/auth/components/PasswordStrength.jsx`
- `src/features/auth/utils/passwordStrength.js`
- `src/features/auth/index.js`

**What changed:** The complete authentication feature was implemented. `AuthContext` and
`AuthProvider` wrap the app and expose the current user and session. `authService.js`
handles all Supabase auth calls (sign in, sign up, sign out, password reset, OAuth).
Five auth pages cover the full credential lifecycle. `PasswordStrength` gives real-time
feedback during registration using `passwordStrength.js` scoring logic.

**Why:** Authentication is the prerequisite for all recipe operations — recipes are
user-scoped via RLS. The auth feature was built as a self-contained unit so it can be
updated or replaced (e.g. swapping Supabase for a custom auth backend) with minimal
impact on the recipes feature.

---

### [v1.3] — Routing, layouts, and protected routes

**Commit type:** `feat`

**Files changed:**
- `src/app/router/index.jsx`
- `src/app/router/ProtectedRoute.jsx`
- `src/app/App.jsx`
- `src/layouts/AppLayout.jsx`
- `src/layouts/AuthLayout.jsx`
- `src/layouts/Header.jsx`
- `src/config/routes.js`

**What changed:** The router was assembled with all routes defined as constants in
`src/config/routes.js`. `ProtectedRoute` wraps authenticated routes and redirects
unauthenticated users to `/login`. `AppLayout` provides the persistent header and
page chrome for authenticated views. `AuthLayout` centres auth forms on a background
image. `Header.jsx` shows auth-aware navigation (links differ between logged-in and
logged-out states).

**Why:** All route strings live in one place to prevent path-typo bugs. The two layout
wrappers (`AppLayout` / `AuthLayout`) enforce visual consistency across the app without
duplicating chrome in every page component.

---

### [v1.4] — Recipe CRUD: service layer, hooks, and form

**Commit type:** `feat`

**Files changed:**
- `src/features/recipes/services/recipeService.js`
- `src/features/recipes/hooks/useRecipes.js`
- `src/features/recipes/types/recipe.types.js`
- `src/features/recipes/utils/recipeValidation.js`
- `src/features/recipes/pages/RecipeFormPage.jsx`
- `src/features/recipes/pages/RecipeDetailPage.jsx`
- `src/features/recipes/index.js`

**What changed:** `recipeService.js` provides all Supabase data access for recipes
(list, get, create, update, delete). `useRecipes.js` is a custom hook that manages
recipe state and exposes loading/error signals. `recipe.types.js` documents the
recipe shape via JSDoc typedefs. `recipeValidation.js` handles form validation rules.
`RecipeFormPage` handles both create and edit via a single form (mode determined by
URL param). `RecipeDetailPage` renders a single recipe with delete confirmation.

**Why:** Separating the data layer (`recipeService.js`) from the hook (`useRecipes.js`)
and the page (`RecipeFormPage.jsx`) follows the single-responsibility principle.
The form handles both create and edit in one component to avoid duplication — the
URL param `?id=...` determines which Supabase call fires on submit.

---

### [v1.5] — Recipe list: search, filtering, sorting, and pagination

**Commit type:** `feat`

**Files changed:**
- `src/features/recipes/components/RecipeCard.jsx`
- `src/features/recipes/components/SearchBar.jsx`
- `src/features/recipes/components/SortDropdown.jsx`
- `src/features/recipes/components/TagFilterChips.jsx`
- `src/features/recipes/components/Pagination.jsx`
- `src/features/recipes/utils/recipeFilters.js`
- `src/features/recipes/pages/RecipeListPage.jsx`
- `src/config/constants.js`

**What changed:** `RecipeListPage` became the primary browse experience.
`SearchBar` filters recipes by title and description text. `TagFilterChips`
filters by tag (multi-select). `SortDropdown` orders results by newest, oldest,
or title. `Pagination` splits results into pages of `RECIPES_PAGE_SIZE` (defined in
`constants.js`). All filter state is synchronised to URL search params so results
survive page refresh and can be bookmarked. `recipeFilters.js` contains the pure
filter/sort/paginate functions — no React, fully testable.

**Why:** URL-synced filters are a deliberate UX decision: a filtered view is a URL that
can be shared or bookmarked. The filter logic living in `recipeFilters.js` (pure
functions) rather than inline in the page component makes it independently testable and
reusable for Phase 2 AI meal planning suggestions.

---

### [v1.6] — Supabase database schema and migrations

**Commit type:** `feat`

**Files changed:**
- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_recipes.sql`
- `supabase/migrations/003_rls.sql`

**What changed:** Three SQL migrations formalise the database schema. Migration 001
creates the `profiles` table extending `auth.users`. Migration 002 creates the `recipes`
table with all Phase 1 fields. Migration 003 applies Row Level Security policies:
`profiles` is readable/writable only by the owning user; `recipes` follows the same rule.

**Why:** Migrations are committed alongside application code so the database schema
is version-controlled and reproducible. Any new environment can be provisioned by
running the migrations in order. RLS is enforced at the database level, not in the
application layer, so there is no code path that could accidentally expose another
user's data regardless of application bugs.

---

### [v1.7] — Architecture documentation

**Commit type:** `docs`

**Files changed:**
- `docs/architecture/frontend-structure.md`

**What changed:** A layer-by-layer rationale document was added covering each directory
in `src/`: its purpose, what it must not contain, how it scales, and how it can be
replaced. The feature module internal layout is also documented with the standardised
`pages/components/hooks/services/utils/types/index.js` structure.

**Why:** The architectural rules are not obvious from file names alone. This document
captures the *intent* behind each boundary so the same structure can be maintained
consistently across Phase 2+ additions without revisiting the original decisions.

---

### [v1.8] — Linting configuration and tooling

**Commit type:** `chore`

**Files changed:**
- `.oxlintrc.json`
- `eslint.config.js`
- `package.json` (lint scripts)

**What changed:** oxlint was configured as the primary linter for general JavaScript rules.
ESLint was retained alongside it for React hooks-specific rules (the `react-hooks` plugin
does not yet exist in oxlint). Two separate `lint` and `lint:eslint` scripts were added to
`package.json` so each tool can be run independently or together.

**Why:** oxlint is significantly faster than ESLint for large codebases (Rust-based).
Running both tools together gives complete coverage: oxlint for general rules at high
speed, ESLint for the React-specific rules that depend on AST context. The two-script
pattern avoids a slow unified config while still catching all relevant issues.
