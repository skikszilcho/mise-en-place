# Frontend Architecture Guide

## Layer Rationale

| Layer | Purpose | Must not contain | Scalability note | Replaceability note |
|---|---|---|---|---|
| `src/app/` | Application bootstrap provider composition and route mounting. | Feature-specific business logic, direct API queries, reusable design primitives. | New providers and app shell concerns can grow here without changing feature folders. | Router/bootstrap can be replaced without touching feature services or components. |
| `src/features/` | Self-contained product modules organised by domain ownership. | Cross-feature generic primitives and global configuration. | Each feature grows independently through its own pages, components, hooks, context, services, utils, and types. | A feature can be extracted or rewritten with limited impact outside its public API. |
| `src/shared/` | Reusable UI primitives and cross-feature utilities used by 2+ areas. | Domain-specific flows (auth-only or recipes-only code), components that import from feature folders. | Shared code grows horizontally as more features consume it. | Shared UI/utilities can later be extracted into an internal package. |
| `src/layouts/` | Route-level chrome wrappers for authenticated and public experiences. Includes `Header.jsx` (which owns auth-aware navigation). | Data fetching, feature orchestration, low-level client calls. | Layout complexity can grow independently from feature code. | Layout system can change without rewriting features or services. |
| `src/services/` | External integration boundaries and third-party client setup. | Page logic, toast logic, route decisions, form state. | Additional integrations can be added one folder at a time. | Backend vendors can be swapped behind these boundaries. |
| `src/config/` | Environment validation, constants, and route/route-pattern definitions. | Rendering logic, service orchestration, feature state. | Centralised config remains easy to audit as the app grows. | Environment and route configuration can change without moving feature files. |
| `src/styles/` | Global CSS and Tailwind base/theme layers. | Component business logic or network code. | Styling concerns scale separately from domain logic. | Styling approach can be replaced with minimal effect on services/features. |
| `src/assets/` | Static assets not owned by a single feature. | Code, configuration, component logic, or scaffold placeholder files. | Asset volume can grow without affecting imports across logic layers. | Assets can move to a CDN/build pipeline independently. |

## Feature Module Structure

Each feature folder follows this internal layout:

```
src/features/[feature]/
├── context/      # React context definition and Provider component
├── hooks/        # Custom hooks (use* prefix); index.js barrel
├── pages/        # Route-level components
├── components/   # UI components owned by this feature
├── services/     # Data-access / API calls for this feature
├── utils/        # Pure helper functions (no React/network imports)
├── types/        # JSDoc @typedef files for domain entities
└── index.js      # Barrel — public API of the feature
```

## Naming Conventions

| Artefact | Convention | Example |
|---|---|---|
| Component file | PascalCase | `RecipeCard.jsx` |
| Hook file | camelCase with `use` prefix | `useRecipes.js` |
| Utility file | camelCase | `recipeFilters.js` |
| Service file | camelCase with `Service` suffix | `recipeService.js` |
| Integration client | camelCase with `Client` suffix | `supabaseClient.js` |
| Types file | camelCase with `.types.js` suffix | `recipe.types.js` |
| Context file | PascalCase with `Context` suffix | `AuthContext.js` |
| Provider file | PascalCase with `Provider` suffix | `AuthProvider.jsx` |
| Feature barrel | `index.js` | `src/features/auth/index.js` |
| Shared barrel | `index.js` | `src/shared/components/index.js` |
| Test file | same filename plus `.test` | `RecipeFormPage.test.jsx` |
| Config file | camelCase or domain noun | `routes.js` |

## Import Rules

1. Import feature public APIs from barrel files when crossing feature boundaries.
2. Pages may import from their own feature's `components/`, `hooks/`, `services/`, `utils/`, and `types/`.
3. Shared UI must be imported from `src/shared/components/index.js` when used outside the shared layer.
4. Low-level third-party clients belong in `src/services/`; feature pages must not import them directly.
5. Config values come from `src/config/`; do not hard-code route strings or environment access in pages.
6. Shared code must not import from feature folders.
7. Features may depend on `shared`, `services`, and `config`, but not on another feature's internal file paths.
8. Layouts may depend on feature public hooks or shared components, but not feature-private services.
9. Route path *patterns* (for `<Route path="...">`) come from `ROUTE_PATTERNS`; resolved paths (for navigation) come from `ROUTES`.

## Route Constants

`src/config/routes.js` exports two objects:

- **`ROUTES`** — resolved path strings and factory functions used for navigation (`<Link to>`, `navigate()`).
- **`ROUTE_PATTERNS`** — static pattern strings used only inside `<Route path="...">` declarations.

This prevents raw path strings appearing in the router and keeps all path knowledge in one file.
