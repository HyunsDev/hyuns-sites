# AGENTS.md for `packages/playground-ui`

This file applies to everything under `packages/playground-ui`.

## Purpose

`@hyunsdev/playground-ui` contains shared shell components and helpers used by
the playground applications.

## Ground Rules

- Keep this package focused on playground composition, not product app UI.
- Prefer `@hyunsdev/ui` primitives for the actual component building blocks.
- Avoid adding assumptions specific to only one playground unless the API name
  makes that ownership clear.
- This workspace consumes `@hyunsdev/ui` from npm; do not change this package to
  depend on a local `packages/ui` workspace.

## Validation

- `pnpm --filter @hyunsdev/playground-ui check`
- Run the affected playground check when shared playground shell behavior changes
