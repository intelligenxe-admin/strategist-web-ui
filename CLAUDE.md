# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build (also validates TypeScript)
npm run start    # Serve production build
npm run lint     # ESLint (eslint-config-next with core-web-vitals + typescript)
```

## Architecture

Next.js 16 App Router with TypeScript, Tailwind CSS v4, and Headless UI.

```
src/
  app/              # Pages (App Router)
  components/       # Reusable UI components
  contexts/         # React context providers (AuthContext)
  hooks/            # Custom React hooks
  services/         # API communication layer
  types/            # Shared TypeScript interfaces
```

### Key patterns

- **Authentication**: `AuthContext` (`src/contexts/AuthContext.tsx`) provides `useAuth()` hook with `login`, `register`, `logout`, `user`, `isAuthenticated`. Token stored in `localStorage("auth")`. `Providers.tsx` wraps the app in `layout.tsx` to keep it a server component.
- **Route protection**: `useRag` and `useWorkflows` hooks redirect unauthenticated users to `/login`. Login page redirects authenticated users to `/rag`.
- **State management**: The `useRag` hook (`src/hooks/useRag.ts`) centralizes all form state and API logic for the RAG page (upload, URL ingestion, query, stats, document management). The `useWorkflows` hook (`src/hooks/useWorkflows.ts`) does the same for the Workflows page (workflow selection, execution, run history). Components receive state via props — no global state manager.
- **API layer**: `src/services/api.ts` uses `fetch` to call local proxy routes. Authenticated requests include `Authorization: Token <key>` header. A shared `authFetch()` helper handles 401 responses globally (clears token, redirects to `/login`).
- **Client vs Server components**: Pages are server components by default. Components needing browser APIs, event handlers, or React state use `"use client"`. Navbar remains a server component with `NavAuth` as a client island.
- **Headless UI**: Used only for the dropdown (`OptionDropdown` uses `Listbox`) and the RAG toggle (`Switch` in `WorkflowForm`). All other inputs use standard HTML elements.
- **Styling**: Tailwind utility classes directly in JSX, with a small set of custom design tokens defined in `src/app/globals.css`:
  - Brand colors: `--brand` (#020266), `--brand-hover` (#03038a), exposed via `@theme inline` as `bg-brand`, `text-brand`, `border-brand`, `ring-brand`. Use these for primary actions, active states, and links — not raw `blue-600`.
  - Fonts: Geist Sans/Mono via `next/font` in `layout.tsx`. The body font is set in `globals.css` as `var(--font-sans), Arial, ...` — don't override on `body`.
  - Dark mode is intentionally NOT implemented. Don't add `dark:` variants or `prefers-color-scheme` rules without a full audit pass.
- **Icons**: `lucide-react` is the standard. Do not hand-roll inline SVGs — import from `lucide-react` (e.g. `Loader2`, `Check`, `X`, `ChevronDown`, `AlertCircle`).
- **Shared UI components** (reuse before adding new variants):
  - `Button` (`src/components/Button.tsx`) — variants: `primary` | `secondary` | `ghost` | `destructive`, sizes `sm` | `md`. Use this instead of writing button class strings inline.
  - `Alert` (`src/components/Alert.tsx`) — variants: `error` | `success` | `warning` | `info`. Use for any colored notification box.
  - `EmptyState` (`src/components/EmptyState.tsx`) — dashed-border placeholder with icon chip + title + optional description and action. Use for empty lists, not "no items" plain text.
  - `SubmitButton` (`src/components/SubmitButton.tsx`) — wraps `Button` with a `Loader2` spinner; use for async form submissions.

### Visual conventions

- **Headings**: H1s use `text-3xl md:text-4xl font-semibold tracking-tight text-gray-900`. Use `font-semibold` (not `font-bold`) and `tracking-tight` for any H1.
- **Body text**: `text-base text-gray-700 leading-relaxed` is the default. Reserve `text-sm` for metadata, captions, helper text, and table cells.
- **Surfaces**: cards/panels that represent a primary surface use `bg-white shadow-sm border border-gray-200 rounded-lg`. Recessed inline boxes (metadata, code) stay flat (`bg-gray-50` or `bg-gray-100`).
- **Tabs**: pill-on-gray pattern (`bg-gray-100 p-1` track, active pill is `bg-white shadow-sm`) — see `app/login/page.tsx` and `app/rag/page.tsx`.
- **Images**: use `next/image` (`<Image>`), not raw `<img>`. The hero logo uses `priority`.

### API proxy routes

External APIs at `intelligenxe.org` don't support CORS, so all requests are proxied through Next.js API routes (`src/app/api/`). Authenticated routes forward the `Authorization` header from the client request.

- `src/app/api/auth/register/route.ts` → POST to `/api/rag/register/` (no auth)
- `src/app/api/auth/login/route.ts` → POST to `/api/rag/login/` (no auth)
- `src/app/api/rag/upload/route.ts` → POST to `/api/rag/upload/` (auth, FormData)
- `src/app/api/rag/query/route.ts` → POST to `/api/rag/query/` (auth, JSON)
- `src/app/api/rag/stats/route.ts` → GET to `/api/rag/stats/` (auth)
- `src/app/api/rag/ingest-urls/route.ts` → POST to `/api/rag/ingest-urls/` (auth, JSON)
- `src/app/api/rag/documents/[filename]/route.ts` → DELETE to `/api/rag/documents/<filename>/` (auth)
- `src/app/api/rag/documents/delete/route.ts` → POST to `/api/rag/documents/delete/` (auth, JSON — body-based deletion for URL documents)
- `src/app/api/rag/clear/route.ts` → DELETE to `/api/rag/clear/` (auth)
- `src/app/api/workflows/route.ts` → GET to `/api/workflows/` (auth)
- `src/app/api/workflows/tools/route.ts` → GET to `/api/workflows/tools/` (auth)
- `src/app/api/workflows/run/route.ts` → POST to `/api/workflows/run/` (auth, JSON, long-running — maxDuration=600)
- `src/app/api/workflows/runs/route.ts` → GET to `/api/workflows/runs/` (auth)
- `src/app/api/workflows/runs/[id]/route.ts` → GET to `/api/workflows/runs/<id>/` (auth)

### API endpoints consumed

- `POST /api/auth/register` — register new user (returns `AuthUser` with token)
- `POST /api/auth/login` — login (returns `AuthUser` with token)
- `POST /api/rag/upload` — upload PDF document with extraction_method
- `POST /api/rag/query` — query knowledge base with question and top_k
- `GET /api/rag/stats` — get user's chunk count and document list
- `POST /api/rag/ingest-urls` — ingest URLs into knowledge base (sends `urls[]` and `source_type`)
- `DELETE /api/rag/documents/<filename>` — delete a specific document
- `POST /api/rag/documents/delete` — delete a document by body payload (used for URL-sourced documents)
- `DELETE /api/rag/clear` — wipe user's knowledge base
- `GET /api/workflows` — list available workflows
- `GET /api/workflows/tools` — list available tools
- `POST /api/workflows/run` — execute a workflow (long-running, 2-5 min)
- `GET /api/workflows/runs` — list user's past workflow runs (last 50)
- `GET /api/workflows/runs/<id>` — get full run details

## Environment

Copy `.env.local` and set:
- `NEXT_PUBLIC_API_BASE_URL` — backend URL (defaults to `http://localhost:8000`)
- `RAG_API_URL` — external RAG API base URL (server-only, defaults to `https://intelligenxe.org/api/rag`)
- `WORKFLOWS_API_URL` — external Workflows API base URL (server-only, defaults to `https://intelligenxe.org/api/workflows`)

## Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
