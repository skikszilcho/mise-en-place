# Mise en Place

> *Mise en place* — French culinary term meaning "everything in its place". A discipline of
> preparation before cooking begins. The same discipline applied to software.

A full-stack recipe and meal management web application built for three purposes:

1. **Learning** — deepen knowledge of JavaScript, React, CSS, authentication, and authorisation
2. **Portfolio** — demonstrate architectural discipline across a multi-phase project
3. **Personal utility** — simplify meal planning, recipe management, and eventually grocery shopping

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth — Email/Password + Google OAuth |
| Language | JavaScript with JSDoc annotations |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter) + ESLint (React hooks rules) |

---

## Project Roadmap

| Phase | Architectural Stage | Key Capability |
|-------|--------------------|-----------------------------|
| 1 ✅ | Foundation | SPA, data persistence, identity, recipe CRUD, observability |
| 2 | Intelligence | AI meal planning, LLM integration |
| 3 | Orchestration | Shopping lists, external service export |
| 4 | Serverless Compute | Edge functions, grocery price comparison |
| 5 | Personalisation | Pantry inventory, cravings, adaptive AI |
| 6 | Mobile | React Native / Expo |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v22+ (includes npm and npx)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) project (free tier is sufficient)

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/mise-en-place.git
cd mise-en-place
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> Both values are found in your Supabase dashboard under **Settings → API**.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint (fast Rust linter) |
| `npm run lint:eslint` | Run ESLint for React hooks rules |

---

## Environment Variables

All environment variables must be prefixed with `VITE_` for Vite to expose them to the browser bundle.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Your Supabase anon (public) key |

---

## Security

### Environment variable model

All environment access is centralised through `src/config/env.js`. The configured Supabase
browser client lives in `src/services/supabase/supabaseClient.js`, but that client still reads
its settings only from the validated exports in `src/config/env.js`. No other file touches
`import.meta.env` directly — this makes it trivial to audit what configuration the application
depends on.

Vite replaces `import.meta.env.*` references with their literal values at build time. Any
variable **not** prefixed with `VITE_` is inaccessible in the browser bundle by design — the
`service_role` key must never appear here.

### Why is the `anon` key safe to include in the frontend?

The Supabase `anon` key is intentionally public-facing. It identifies your project but grants
**no access** beyond what Row Level Security (RLS) policies permit. RLS is enforced at the
database level on every query — a user can only read or modify rows they own, regardless of
which client key initiated the request.

**Security rules:**
- Never include the `service_role` key anywhere in `src/` — it bypasses RLS entirely
- Never commit `.env.local` to git — it is listed in `.gitignore`
- `.env.example` (committed) contains only blank placeholders — never real credentials
- All route constants are centralised in `src/config/routes.js`, and mounted from `src/app/router/index.jsx`, to prevent path-typo bugs

### For production deployment

When deploying (e.g., to Vercel or Netlify), set environment variables in the hosting
platform's secrets dashboard — never in a committed file.

Add a `Content-Security-Policy` header in your hosting configuration to restrict which
origins the app may load resources from. Example (Vercel `vercel.json`):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; connect-src 'self' https://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com"
        }
      ]
    }
  ]
}
```

---

## Folder Structure

```
src/
├── app/             # App shell, bootstrap entry, and route mounting
├── assets/          # Images, icons, fonts
├── config/          # Environment validation, constants, route paths
├── features/
│   ├── auth/        # Auth pages, auth context, and auth service adapters
│   └── recipes/     # Recipe pages, feature UI, hooks, services, and utils
├── layouts/         # Route-level page chrome wrappers
├── services/        # External integration clients (e.g. Supabase)
├── shared/          # Shared UI primitives and cross-feature utilities
├── styles/          # Global CSS and Tailwind base layer
├── App.jsx          # Compatibility re-export to src/app/App.jsx
└── main.jsx         # Compatibility entry forwarding to src/app/main.jsx
```

---

## Database Schema (Phase 1)

| Table | Purpose |
|-------|---------|
| `profiles` | Extends `auth.users`; stores username and avatar |
| `recipes` | Core recipe data — flat structure in Phase 1, normalised in Phase 2 |

All tables have Row Level Security enabled. Users can only access their own data.
