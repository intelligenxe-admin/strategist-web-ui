# CLAUDE.md

Guidance for Claude Code working in this repository.

## Commands

```bash
npm run dev      # Dev server (http://localhost:3000)
npm run build    # Production build (also typechecks)
npm run start    # Serve production build
npm run lint     # eslint-config-next (core-web-vitals + typescript)
```

## Architecture

Next.js 16 App Router, TypeScript, Tailwind CSS v4, Headless UI. `@/*` maps to `./src/*` (tsconfig.json).

```
src/
  app/              # Pages + API routes (App Router)
  components/       # Reusable UI
  contexts/         # React context (AuthContext)
  hooks/            # Custom hooks (useRag, useWorkflows)
  services/         # API client
  types/            # Shared TS interfaces
```

### Key patterns

- **Auth**: `AuthContext` (`src/contexts/AuthContext.tsx`) exposes `useAuth()` with `login`, `register`, `logout`, `user`, `isAuthenticated`. Token in `localStorage("auth")`. `Providers.tsx` wraps the tree in `layout.tsx` so the layout stays a server component. `useRag` and `useWorkflows` redirect unauthenticated users to `/login`; `/login` redirects authed users to `/rag`.
- **State**: `useRag` and `useWorkflows` centralize all page state and API calls; components receive props. No global store.
- **API client**: `src/services/api.ts` calls local proxy routes via `fetch`. `authFetch()` attaches `Authorization: Token <key>` and globally handles 401 (clears token, redirects to `/login`).
- **Server vs client components**: pages are server components by default; add `"use client"` only when browser APIs/state/handlers are needed. Navbar is a server component with `NavAuth` as a client island.
- **Headless UI**: `Listbox` in `OptionDropdown` and `Switch` in `WorkflowForm`. Everything else is plain HTML.

### Styling

Tailwind utilities in JSX, with tokens in `src/app/globals.css`:

- **Brand colors**: `--brand` (#020266), `--brand-hover` (#03038a), exposed via `@theme inline` as `bg-brand` / `text-brand` / `border-brand` / `ring-brand`. Use these for primary actions, active states, and links — not raw `blue-600`.
- **Fonts**: Geist Sans/Mono via `next/font` in `layout.tsx`. Body font is set in `globals.css` — don't override on `body`.
- **Dark mode**: intentionally not implemented. Don't add `dark:` variants or `prefers-color-scheme` rules without a full audit.
- **Icons**: import from `lucide-react`. Don't hand-roll inline SVGs.
- **Images**: `next/image`, not `<img>`. Hero logo uses `priority`.

### Shared UI components (reuse before adding variants)

- `Button` — `primary` | `secondary` | `ghost` | `destructive`, sizes `sm` | `md`.
- `SubmitButton` — `Button` + `Loader2` spinner for async forms.
- `Alert` — `error` | `success` | `warning` | `info`. Any colored notification box.
- `EmptyState` — dashed-border placeholder with icon chip + title + optional description/action. Any empty list.

### Visual conventions

- **H1**: `text-3xl md:text-4xl font-semibold tracking-tight text-gray-900` — `font-semibold` (not `font-bold`), `tracking-tight`.
- **Body**: `text-base text-gray-700 leading-relaxed`. Reserve `text-sm` for metadata, captions, helper text.
- **Surfaces**: primary cards/panels use `bg-white shadow-sm border border-gray-200 rounded-lg`. Recessed inline boxes (metadata, code) stay flat with `bg-gray-50` or `bg-gray-100`.
- **Tabs**: pill-on-gray (`bg-gray-100 p-1` track, active pill `bg-white shadow-sm`) — see `app/login/page.tsx`, `app/rag/page.tsx`.

### API routes

External APIs at `intelligenxe.org` don't support CORS, so every request is proxied through `src/app/api/`. Authenticated proxies forward the client's `Authorization` header.

| Local proxy (`src/app/api/...`) | External method + path | Notes |
|---|---|---|
| `auth/register/route.ts` | POST `/api/rag/register/` | no auth |
| `auth/login/route.ts` | POST `/api/rag/login/` | no auth |
| `rag/upload/route.ts` | POST `/api/rag/upload/` | FormData, with `extraction_method` |
| `rag/query/route.ts` | POST `/api/rag/query/` | JSON, takes `question`, `top_k` |
| `rag/stats/route.ts` | GET `/api/rag/stats/` | chunk count + document list |
| `rag/ingest-urls/route.ts` | POST `/api/rag/ingest-urls/` | JSON, `urls[]`, `source_type` |
| `rag/documents/[filename]/route.ts` | DELETE `/api/rag/documents/<filename>/` | filename-in-path |
| `rag/documents/delete/route.ts` | POST `/api/rag/documents/delete/` | body-based; for URL docs |
| `rag/clear/route.ts` | DELETE `/api/rag/clear/` | wipe user's knowledge base |
| `workflows/route.ts` | GET `/api/workflows/` | list workflows |
| `workflows/tools/route.ts` | GET `/api/workflows/tools/` | list tools |
| `workflows/run/route.ts` | POST `/api/workflows/run/` | long-running, `maxDuration=600` |
| `workflows/runs/route.ts` | GET `/api/workflows/runs/` | last 50 runs |
| `workflows/runs/[id]/route.ts` | GET `/api/workflows/runs/<id>/` | full run detail |

## Environment

Copy `.env.local` and set:

- `NEXT_PUBLIC_API_BASE_URL` — backend URL (default `http://localhost:8000`)
- `RAG_API_URL` — external RAG base (server-only, default `https://intelligenxe.org/api/rag`)
- `WORKFLOWS_API_URL` — external Workflows base (server-only, default `https://intelligenxe.org/api/workflows`)
