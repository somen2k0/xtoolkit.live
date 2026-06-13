# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

Use **pnpm only**. The `preinstall` hook enforces this and will reject npm/yarn. Always run `pnpm install` (never `npm install` or `yarn`).

## Common Commands

```bash
# Install all workspace dependencies
pnpm install

# Typecheck everything (libs + all artifacts)
pnpm typecheck

# Full build (typecheck + build all packages)
pnpm build

# Frontend dev server (http://localhost:5173)
pnpm --filter @workspace/x-checker run dev

# API server dev (builds then starts on port defined in env)
pnpm --filter @workspace/api-server run dev

# Chrome extension — watch/rebuild on change
pnpm --filter @workspace/x-toolkit-extension run dev

# Regenerate API client and Zod schemas from openapi.yaml
pnpm --filter @workspace/api-spec run codegen
```

## Architecture Overview

This is a **pnpm monorepo** deployed to Vercel. The site is `xtoolkit.live` — a toolkit of 44 web tools organized into categories (social media, AI writing, text formatting, developer, SEO, email).

### Workspace layout

```
artifacts/x-checker/         # Main React SPA (Vite + Tailwind + Radix/shadcn)
artifacts/api-server/        # Express.js backend (serverless on Vercel)
artifacts/x-toolkit-extension/  # Chrome extension (MV3, React popup)
artifacts/mockup-sandbox/    # UI design prototyping sandbox (not deployed)
lib/api-spec/                # OpenAPI spec + Orval codegen config
lib/api-client-react/        # Generated React Query hooks (DO NOT EDIT MANUALLY)
lib/api-zod/                 # Generated Zod schemas (DO NOT EDIT MANUALLY)
scripts/                     # One-off utility scripts
api/[...path].ts             # Vercel serverless entry — proxies to api-server dist
```

### Frontend (`artifacts/x-checker`)

- **Router**: `wouter` — all routes defined in `src/App.tsx`
- **Data fetching**: TanStack React Query; API hooks come from `@workspace/api-client-react`
- **UI**: shadcn/ui components (in `src/components/ui/`), Tailwind CSS v4, Framer Motion
- **State**: No global state manager; component-local state + React Query
- **Tool registry**: `src/lib/tools-registry.ts` + `src/lib/tools-manifest.json` — the canonical list of all tools with metadata (slug, title, category, description). Add new tools here first.
- **SEO**: `src/components/SeoHead.tsx` + per-page usage of `useSeo` hook
- **Analytics**: GA4 (`G-0544DCZ399`) via `src/lib/analytics.ts`; `useTrack` / `use-local-analytics` hooks
- **Lazy loading**: All pages except `Home` and `NotFound` are `React.lazy`-loaded; `Home` is eagerly imported to avoid LCP delay
- **Theme**: Dark/light via `src/lib/theme.tsx` (next-themes)

### Backend (`artifacts/api-server`)

- **Framework**: Express v5, built with esbuild into ESM (`dist/handler.mjs` for Vercel, `dist/index.mjs` for long-running server)
- **Security middleware stack** (applied to all `/api/*`): Helmet → global rate limit (100 req/15 min) → per-route rate limit (20 req/min) → XSS clean → HPP → input length validator → SQL injection blocker
- **AI routes**: Groq API for bio generation and AI text detection. Multiple GROQ_API_KEY values (comma-separated) are rotated automatically with a 60s cooldown per exhausted key. Bio routes skip response caching; detector routes cache responses.
- **Temp mail providers**: guerrilla, freemail, onesecmail, harakirimail — each has its own route file proxying the respective third-party API
- **CORS**: Production allows only `https://xtoolkit.live` and `*.replit.dev`; development allows all origins

### API client generation

The source of truth is `lib/api-spec/openapi.yaml`. Running `pnpm --filter @workspace/api-spec run codegen` (via Orval) regenerates:
- `lib/api-client-react/src/generated/` — React Query hooks used in the frontend
- `lib/api-zod/src/generated/` — Zod validators used in the backend

Never manually edit files in those `generated/` directories.

### Vercel deployment

`vercel.json` defines:
- Build command: builds frontend (Vite) then api-server (esbuild)
- Output: `artifacts/x-checker/dist/public`
- Serverless function: `api/[...path].ts` (max 30s, includes `artifacts/api-server/dist/**`)
- Redirects for removed/renamed tool paths (permanent 301s)
- Security headers (CSP, HSTS, X-Frame-Options, etc.) applied globally

### Environment variables

See `.env.example` for all variables. Key ones:
- `TWITTER_BEARER_TOKEN` — required for X Account Checker
- `GROQ_API_KEY` — comma-separated keys for AI tools (bio generator, AI detector)
- `ADMIN_PASSWORD` — enables `/admin` panel (header: `x-admin-password`)
- `WEB3FORMS_KEY` / `VITE_WEB3FORMS_KEY` — contact form (server-side and client-side respectively)
- `RAPIDAPI_KEYS` — optional, for Gmailnator backend route only

`VITE_*` variables are embedded in the browser bundle at build time — never put secrets in them.
