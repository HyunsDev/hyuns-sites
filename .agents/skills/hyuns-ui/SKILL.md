---
name: hyuns-ui
description: Use when building, modifying, reviewing, or documenting Hyuns UI usage inside the hyuns-sites workspace, including @hyunsdev/ui npm consumption, @hyunsdev/playground-ui playground shell exports, @workspace/site-ui facade exports, app-level React/Tailwind v4 styling, portal.yml-driven navigation, web-color UI integration, and validation of apps that consume Hyuns UI.
---

# Hyuns UI in hyuns-sites

Build and maintain Hyuns UI usage in `hyuns-sites`. This workspace consumes the published `@hyunsdev/ui` package; it is not the `hyuns-ui` design-system source repo.

## Required Context

1. Inspect `package.json`, `pnpm-workspace.yaml`, and `turbo.json` for workspace filters and validation commands.
2. Read the target app or package manifest before editing: `apps/portal/package.json`, `apps/web-color/package.json`, `apps/example/package.json`, `packages/site-ui/package.json`, or `packages/playground-ui/package.json`.
3. Read the target app CSS entry before changing styling. Current Tailwind v4 entries import `tailwindcss`, `@hyunsdev/ui/globals.css`, and local `@source` scanning.
4. If the task touches the Portal, read `apps/portal/src/portal.yml`, `apps/portal/src/portal-data.ts`, `apps/portal/src/portal-icons.tsx`, and `apps/portal/src/app.test.tsx`.
5. If the task touches Web Color routes or visualizations, read the matching files under `apps/web-color/src`, including `routeTree.gen.ts` only as generated output.

## Current Reality

- Workspace shape: `apps/*` and `packages/*` managed by pnpm and Turbo.
- Published dependency: apps consume `@hyunsdev/ui@^0.2.0` from npm. Do not reintroduce a local `link:../hyuns-ui/packages/ui` unless the user explicitly asks.
- Local playground package: `@hyunsdev/playground-ui` lives in `packages/playground-ui` and provides shared playground shell composition.
- Local facade: `@workspace/site-ui` is intentionally thin; do not use it as a catch-all export surface for `@hyunsdev/ui`.
- Portal source of truth: `apps/portal/src/portal.yml`; icon names resolve through `apps/portal/src/portal-icons.tsx`.
- Web Color uses TanStack Router. `apps/web-color/src/routeTree.gen.ts` is generated; do not hand-edit it.
- This checkout has no `packages/ui` and no `playground/ui-playground`. Those belong to the separate `hyuns-ui` repo, not this workspace.

## Imports

Use public `@hyunsdev/ui` exports already proven in this workspace:

```ts
import { MainProvider } from "@hyunsdev/ui/components/main-provider"
import { Badge } from "@hyunsdev/ui/components/badge"
import { Button } from "@hyunsdev/ui/components/button"
import { Slider } from "@hyunsdev/ui/components/slider"
import { Switch } from "@hyunsdev/ui/components/switch"
import { useTheme } from "@hyunsdev/ui/components/theme-provider"
import { cn } from "@hyunsdev/ui/lib/utils"
```

The root `@hyunsdev/ui` entry is used in this workspace for `Button` and `buttonVariants`. Use subpath imports for broader component, provider, hook, and utility surfaces. Do not import from `@hyunsdev/ui/src/*` or `@hyunsdev/ui/dist/*`.

CSS entries should look like:

```css
@import "tailwindcss";
@import "@hyunsdev/ui/globals.css";
@source "./**/*.{ts,tsx}";
```

## Workflow

1. Identify the target surface: Portal, Web Color, example app, `@hyunsdev/playground-ui`, `@workspace/site-ui`, shared config, style entry, route registration, or browser-visible UI behavior.
2. Prefer published `@hyunsdev/ui` components and tokens over copying shadcn code or design-system source into this repo.
3. Keep product data, routing, YAML parsing, app copy, and visualization behavior inside the consuming app.
4. Expand `@workspace/site-ui` only when a local facade is useful across apps. Add or update `packages/site-ui/src/index.test.tsx` when changing its exports.
5. When changing Portal links or categories, update `portal.yml`, icon mapping, and tests together so rendered data and assertions do not drift.
6. When changing Web Color routes, let the repo's route-generation/build path update `routeTree.gen.ts`; never edit generated route trees by hand.
7. Use Hyuns UI CSS tokens and Tailwind v4 classes. Avoid product-specific hardcoded color systems when a token or existing local semantic class is enough.
8. Add browser verification for layout, interaction, canvas rendering, responsive behavior, or Tailwind output.

## Validation

- Run `pnpm --filter <target> check` after changing an app or package.
- Run `pnpm --filter <target> build` when route registration, CSS entries, generated assets, Vite config, or deploy output can change.
- Run `pnpm --filter hyuns-portal check` and usually `pnpm --filter hyuns-portal build` after Portal UI, YAML, router, or icon changes.
- Run `pnpm --filter web-color check` and usually `pnpm --filter web-color build` after Web Color UI, route, canvas, or color-model changes.
- Run `pnpm --filter @hyunsdev/playground-ui check` after changing the playground shell package.
- Run `pnpm --filter @workspace/site-ui check` and `pnpm --filter @workspace/site-ui build` after changing the local facade.
- Run root `pnpm check` or `pnpm build` when shared packages, workspace config, or cross-app behavior changes.
- Use browser or Playwright verification when behavior depends on real browser APIs, layout, interaction, canvas, or Tailwind output.

## Stale Guidance to Avoid

- Do not ask for or read `packages/ui/SKILL.md`, `packages/ui/package.json`, or `playground/ui-playground` in this repo.
- Do not run `pnpm --filter @hyunsdev/ui check`, `smoke:consumer`, or `pack:dry-run` from `hyuns-sites`; those are design-system repo validations.
- Do not claim package export-map or publish-surface verification from this workspace. Verify consumption here; change and publish the design system in `/Users/hyuns/repos/hyuns-ui` only when that is the requested repo.
