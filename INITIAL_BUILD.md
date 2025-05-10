# Mise en Place — Initial Build

This document records the **exact state of the project at first commit**: every file that
existed, every decision that was made, and every dependency that was installed. It is a
permanent snapshot — it is never edited after the initial commit is made.

---

## What Was Built

A full-stack recipe management web application with authentication, recipe CRUD operations,
search, tag filtering, sorting, pagination, and a layered React architecture designed to scale
across six planned phases.

**Phase 1 is complete.** The application is functional end-to-end: users can register, log in,
create and manage recipes, and browse their collection with filters and search.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Vite + React | React 19, Vite 8 |
| Routing | React Router | v7 |
| Styling | Tailwind CSS | v3 |
| Backend / DB | Supabase | PostgreSQL + RLS |
| Auth | Supabase Auth | Email/Password + Google OAuth |
| Language | JavaScript | JSDoc-annotated |
| Linting | oxlint + ESLint | oxlint 1.x |

---

## File Structure at Initial Commit

```
mise-en-place/
├── .env.example                          # env var template (blank values only)
├── .gitignore                            # excludes node_modules, dist, .env.local
├── .oxlintrc.json                        # oxlint configuration
├── eslint.config.js                      # ESLint config (React hooks rules)
├── index.html                            # Vite entry point
├── package.json                          # dependencies and scripts
├── package-lock.json                     # locked dependency tree
├── postcss.config.js                     # PostCSS for Tailwind
├── tailwind.config.js                    # Tailwind theme configuration
├── vite.config.js                        # Vite project configuration
├── README.md                             # project documentation
│
├── public/
│   ├── favicon.svg
│   ├── icons.svg                         # SVG sprite for UI icons
│   └── images/
│       └── background-login.jpg          # auth page background image
│
├── docs/
│   └── architecture/
│       └── frontend-structure.md         # layer rationale and feature module layout
│
├── supabase/
│   └── migrations/
│       ├── 001_profiles.sql              # profiles table (extends auth.users)
│       ├── 002_recipes.sql               # recipes table with RLS
│       └── 003_rls.sql                   # Row Level Security policies
│
└── src/
    ├── main.jsx                          # app bootstrap / React DOM entry
    ├── app/
    │   ├── App.jsx                       # root component with providers
    │   └── router/
    │       ├── index.jsx                 # route definitions
    │       └── ProtectedRoute.jsx        # auth guard wrapper
    ├── assets/
    │   ├── background-login.jpg
    │   └── hero.png
    ├── config/
    │   ├── constants.js                  # RECIPES_PAGE_SIZE and other app constants
    │   ├── env.js                        # validates + exports VITE_* env vars
    │   └── routes.js                     # ROUTES constants (all path strings)
    ├── features/
    │   ├── auth/
    │   │   ├── index.js                  # public barrel export
    │   │   ├── context/
    │   │   │   ├── AuthContext.js
    │   │   │   └── AuthProvider.jsx
    │   │   ├── hooks/
    │   │   │   ├── index.js
    │   │   │   └── useAuth.js
    │   │   ├── pages/
    │   │   │   ├── AuthCallback.jsx
    │   │   │   ├── ForgotPasswordPage.jsx
    │   │   │   ├── LoginPage.jsx
    │   │   │   ├── RegisterPage.jsx
    │   │   │   └── ResetPasswordPage.jsx
    │   │   ├── services/
    │   │   │   └── authService.js
    │   │   ├── components/
    │   │   │   └── PasswordStrength.jsx
    │   │   └── utils/
    │   │       └── passwordStrength.js
    │   └── recipes/
    │       ├── index.js
    │       ├── components/
    │       │   ├── Pagination.jsx
    │       │   ├── RecipeCard.jsx
    │       │   ├── SearchBar.jsx
    │       │   ├── SortDropdown.jsx
    │       │   └── TagFilterChips.jsx
    │       ├── hooks/
    │       │   └── useRecipes.js
    │       ├── pages/
    │       │   ├── RecipeDetailPage.jsx
    │       │   ├── RecipeFormPage.jsx
    │       │   └── RecipeListPage.jsx
    │       ├── services/
    │       │   └── recipeService.js
    │       ├── types/
    │       │   └── recipe.types.js
    │       └── utils/
    │           ├── recipeFilters.js
    │           └── recipeValidation.js
    ├── layouts/
    │   ├── AppLayout.jsx                 # authenticated shell (header + outlet)
    │   ├── AuthLayout.jsx                # public auth pages shell
    │   └── Header.jsx                    # navigation with auth-aware links
    ├── services/
    │   └── supabase/
    │       └── supabaseClient.js         # configured Supabase JS client
    ├── shared/
    │   ├── components/
    │   │   ├── Button.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── ErrorBoundary.jsx
    │   │   ├── ErrorMessage.jsx
    │   │   ├── FormError.jsx
    │   │   ├── index.js
    │   │   ├── Input.jsx
    │   │   ├── SkeletonCard.jsx
    │   │   └── Spinner.jsx
    │   └── utils/
    │       ├── errorMessages.js
    │       ├── index.js
    │       ├── logger.js
    │       └── withErrorHandling.js
    └── styles/
        └── index.css                     # Tailwind base + global overrides
```

---

## Database Schema

### Table: `profiles`
- Extends `auth.users` via foreign key on `id`
- Fields: `id`, `username`, `avatar_url`, `created_at`, `updated_at`
- RLS: users read/write their own row only

### Table: `recipes`
- Fields: `id`, `user_id`, `title`, `description`, `ingredients` (text[]), `steps` (text[]),
  `tags` (text[]), `prep_time`, `cook_time`, `servings`, `image_url`, `created_at`, `updated_at`
- RLS: users read/write their own recipes only

---

## Key Architectural Decisions Made at Build Time

| Decision | Choice | Reason |
|----------|--------|--------|
| State management | React Context (AuthContext) only | Phase 1 scope does not require global server-state cache |
| Env var access | Centralised through `src/config/env.js` | Single audit point; no `import.meta.env` spread across files |
| Route constants | `src/config/routes.js` | Prevents path-typo bugs; single source of truth |
| Feature structure | `features/[domain]/pages/hooks/services/utils/types` | Scales independently per domain |
| Error boundary | `ErrorBoundary.jsx` wraps the router | Catches render errors at the app shell level |
| Linting | oxlint (fast) + ESLint (React hooks) | oxlint handles general rules; ESLint fills the React hooks gap |
| Image in `src/assets/` AND `public/images/` | Both present | `src/assets/` for Vite-bundled imports; `public/` for direct URL references |

---

## What Is Explicitly Not Included

- `node_modules/` — installed via `npm install`
- `dist/` — generated via `npm run build`
- `.env.local` — contains real Supabase credentials; excluded by `.gitignore`
- Any AI meal planning, shopping lists, or Phase 2+ features
