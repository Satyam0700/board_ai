# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

## Current Phase

- Phase 12 — Shape Panel

## Current Goal

- Add a bottom shape panel so users can drag shapes onto the canvas and create new nodes.

## Completed

- Project scaffolded with Next.js 16, Tailwind 4, TypeScript.
- Boilerplate cleaned — minimal page.tsx and globals.css.
- `01-design-system` — shadcn/ui initialized (Radix + Nova preset), 7 components installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), `cn()` utility created in `lib/utils.ts`, `lucide-react` installed, dark-only theme tokens configured in `globals.css`, `dark` class applied to `<html>`.
- `02-editor` — `components/editor/editor-navbar.tsx` (fixed-height top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose icons) and `components/editor/project-sidebar.tsx` (floating overlay sidebar, My Projects + Shared tabs with empty states, New Project button). TypeScript compiles cleanly.
- `03-auth` — Clerk Provider wired, proxy.ts created, auth routes protected, custom sign-in/sign-up pages created with dark theme and CSS variables. Auth UI redesigned to match reference design (logo, headline, icon feature list, copyright). Geist Sans font token fixed in globals.css.
- `app/editor/page.tsx` created — wires EditorNavbar + ProjectSidebar with local sidebar state; resolves post-auth /editor 404.
- `04-project-dialogs` — Editor home, Create/Rename/Delete dialogs, sidebar project items, and hook implementation.
- `05-prisma` — `prisma/models/project.prisma` with Project (ownerId, name, description, status enum, canvasJsonPath, timestamps, indexes) and ProjectCollaborator (cascade delete, email, unique constraint, indexes). `lib/prisma.ts` singleton with Accelerate/direct-pg branching based on DATABASE_URL prefix. `@prisma/extension-accelerate` installed. Migration `20260515095901_init_projects` applied. `npm run build` passes.
- `06-project-apis` — Built `app/api/projects/route.ts` and `app/api/projects/[projectId]/route.ts`. Endpoints implemented for list, create, rename, and delete. Clerk auth enforced (401) and owner checks enforced for rename/delete (403). `id` follows Prisma cuid defaults. Fixed Next.js 16 dynamic route Promise `params` resolution. Resolved Prisma union type issue in `lib/prisma.ts`. `npm run build` passes.
- `07-wire-editor-home` - Wired the editor home sidebar and dialogs to the real project API. Created `useProjectActions` hook. Refactored `app/editor/page.tsx` into a server component fetching real Prisma data and `EditorClient` client component. Added room ID preview. `npm run build` passes.
- `08-editor-workspace-shell` - Created `lib/project-access.ts` with Clerk identity and Prisma access checks. Built `/editor/[roomId]` server component with ownership/collaboration checks. Implemented `WorkspaceClient` layout (navbar with project name, left sidebar, canvas placeholder, right AI sidebar placeholder). Created `AccessDenied` fallback.
- `09-share-dialog` - Created `ShareDialog` component, allowing owners to invite/remove collaborators by email and all users to copy the project link. Built API routes for listing, inviting, and removing collaborators with server-side ownership enforcement. Displayed Clerk user names and avatars for collaborators when available.
- `10-liveblocks-setup` - Configured `liveblocks.config.ts` with Presence (cursor, isThinking) and UserMeta (name, avatar, cursorColor) types. Created `lib/liveblocks.ts` with a lazily-initialized cached Liveblocks node client and deterministic cursor color helper. Built `POST /api/liveblocks-auth` route that verifies Clerk auth, checks project access via `checkProjectAccess`, ensures the Liveblocks room exists with `getOrCreateRoom`, and returns a session token with user metadata. Installed `@liveblocks/node`. `npm run build` passes.
- `11-base-canvas` - Set up React Flow with `@liveblocks/react-flow`. Added `CanvasWrapper` with Liveblocks room providers, suspense, and error boundaries. Created `Canvas` component with synced nodes and edges using `useLiveblocksFlow`. Added `types/canvas.ts` for node and edge types. `npm run build` passes.

- `12-shape-panel` - Implemented floating shape panel with drag-and-drop support. Created custom `CanvasNodeComponent` renderer for multiple shapes (rectangle, circle, diamond, pill, cylinder, hexagon). Integrated with React Flow and Liveblocks for collaborative shape creation. `npm run build` passes.

## In Progress

- Wait for next task.

## Next Up

- Wait for next task.

## Open Questions

- None.

## Architecture Decisions

- Using Tailwind 4 with CSS custom properties mapped via `@theme inline`.
- shadcn/ui components live in `components/ui/` and remain unmodified after generation.
- Dark-only theme: `dark` class on `<html>`, no light/dark toggle. All shadcn semantic variables point to project dark palette.
- Project design tokens (bg-base, text-copy-primary, border-surface-border, text-brand, bg-accent-dim, etc.) coexist alongside shadcn tokens for app-level components.
- Prisma v7 multi-file schema: generator + datasource in `prisma/schema.prisma`, models in `prisma/models/`. Client generated to `app/generated/prisma`.
- Prisma client branches on DATABASE_URL prefix: `prisma+postgres://` → Accelerate extension, otherwise → direct `@prisma/adapter-pg`.

## Session Notes

- Design system implementation verified: TypeScript compiles cleanly, production build passes, dark theme renders in browser.
- Auth pages redesigned to match reference screenshot. Font token (--font-sans) was self-referencing and fixed to point to --font-geist-sans.
- Prisma migration applied to remote Prisma Postgres instance. Build verified with zero TS errors.
- Added Project API routes and fixed Prisma client type union issue (`This expression is not callable`) by returning `$extends(withAccelerate())` on all branches in `lib/prisma.ts`. Evaluated `params` as a Promise in Next.js 16 app router dynamic routes.
