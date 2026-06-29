# Hyuns Sites Design System

## 1. Atmosphere & Identity

Hyuns Sites is a quiet utility workspace: direct, compact, and optimized for repeated use. The signature is technical restraint: dense controls float over interactive canvases using Hyuns UI semantic tokens, letting the work surface stay visually primary.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `--background-primary` | Hyuns UI token | Hyuns UI token | App panels, overlays, canvas chips |
| Surface/secondary | `--background-secondary` | Hyuns UI token | Hyuns UI token | Page backgrounds and subtle utility bands |
| Text/primary | `--text-normal` | Hyuns UI token | Hyuns UI token | Primary readable text |
| Text/secondary | `--text-muted` | Hyuns UI token | Hyuns UI token | Labels, metadata, secondary controls |
| Border/default | `--border` | Hyuns UI token | Hyuns UI token | Panel outlines, controls, chips |
| Accent/interactive | Hyuns UI component tokens | Hyuns UI token | Hyuns UI token | Button, switch, slider, focus states |

### Rules

- Use `@hyunsdev/ui/globals.css` semantic tokens before introducing app-local color.
- Visualization colors may come from color-model data when they represent actual color-space samples.
- Raw hex values are reserved for rendering-library constants where the external API requires a literal color.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| H1 | `text-sm` to `text-base` | 700 | 1.4 | 0 | Playground title code label |
| Body | `text-sm` | 400 | 1.5 | 0 | Navigation labels and body |
| Caption | `text-xs` | 400 to 500 | 1.5 | 0 | Descriptions and hints |

### Font Stack

- Primary: inherited from `@hyunsdev/ui/globals.css`
- Mono: inherited from `@hyunsdev/ui/globals.css`

### Rules

- Playground pages use compact type because they are tools, not marketing pages.
- Use code styling for page titles when matching the shared playground shell.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a 4px base through Tailwind spacing tokens.

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Tight item groups |
| `gap-2` | 8px | Icon and label groups |
| `gap-4` | 16px | Index item groups |
| `px-4` | 16px | Compact horizontal page padding |
| `px-6` | 24px | Standard playground page padding |
| `py-10` | 40px | Playground content area |

### Grid

- Max content width comes from shared Hyuns UI layout components.
- Breakpoints follow Tailwind defaults: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px.

### Rules

- Use `min-h-svh` or `min-h-[100svh]` for full-height app shells.
- Keep first screens usable on mobile without horizontal scrolling.

## 5. Components

### Playground Index Page

- **Structure**: `PlaygroundIndexPage` from `@workspace/playground-ui/PlaygroundRoute` wraps grouped `PlaygroundRouteIndex` items.
- **Variants**: root landing index, nested route hub.
- **Spacing**: inherited from `NavigationIndexPage`; use `gap-4` for item groups.
- **States**: shared navigation items handle hover, active press, focus, disabled, and transition state.
- **Accessibility**: title and description must identify the surface; route items use text labels and icons.
- **Motion**: use shared playground route transition behavior.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | Shared Hyuns UI token | Shared Hyuns UI easing | Button hover and press |
| Standard | Shared playground route timing | Shared playground route easing | Index item navigation |

### Rules

- Do not add custom page animation when a shared playground component already owns the transition.
- Preserve focus-visible behavior from Hyuns UI controls.

## 7. Depth & Surface

### Strategy

Use tonal shift plus lightweight borders from Hyuns UI components.

| Type | Value | Usage |
|------|-------|-------|
| Background shift | `bg-background-secondary` | Playground shells |
| Dot grid | `bg-dot-grid` | Playground index surfaces |
| Border | Hyuns UI control border | Buttons and index items |

No standalone decorative cards or shadows for first-screen playground navigation.
