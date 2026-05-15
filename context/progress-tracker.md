# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 5 — Prisma Schema & Data Layer ✓

## Current Goal

- Prisma data layer complete. Project and ProjectCollaborator models defined, migration applied, client singleton created with Accelerate/direct-pg branching. Ready for next feature unit.

## Completed

- Project scaffolded with Next.js 16, Tailwind 4, TypeScript.
- Boilerplate cleaned — minimal page.tsx and globals.css.
- `01-design-system` — shadcn/ui initialized (Radix + Nova preset), 7 components installed (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), `cn()` utility created in `lib/utils.ts`, `lucide-react` installed, dark-only theme tokens configured in `globals.css`, `dark` class applied to `<html>`.
- `02-editor` — `components/editor/editor-navbar.tsx` (fixed-height top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose icons) and `components/editor/project-sidebar.tsx` (floating overlay sidebar, My Projects + Shared tabs with empty states, New Project button). TypeScript compiles cleanly.
- `03-auth` — Clerk Provider wired, proxy.ts created, auth routes protected, custom sign-in/sign-up pages created with dark theme and CSS variables. Auth UI redesigned to match reference design (logo, headline, icon feature list, copyright). Geist Sans font token fixed in globals.css.
- `app/editor/page.tsx` created — wires EditorNavbar + ProjectSidebar with local sidebar state; resolves post-auth /editor 404.
- `04-project-dialogs` — Editor home, Create/Rename/Delete dialogs, sidebar project items, and hook implementation.
- `05-prisma` — `prisma/models/project.prisma` with Project (ownerId, name, description, status enum, canvasJsonPath, timestamps, indexes) and ProjectCollaborator (cascade delete, email, unique constraint, indexes). `lib/prisma.ts` singleton with Accelerate/direct-pg branching based on DATABASE_URL prefix. `@prisma/extension-accelerate` installed. Migration `20260515095901_init_projects` applied. `npm run build` passes.

## In Progress

- None.

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
