# Hyuns Sites UI Design System

## 1. Atmosphere & Identity

Hyuns Sites UI should feel like a quiet component workbench: technical, direct, and easy to scan. The signature is a dot-grid workspace with compact navigation controls, restrained typography, and Hyuns UI tokens doing the visual work rather than one-off decoration.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `--background` | Hyuns UI token | Hyuns UI token | App background |
| Surface/secondary | `--background-secondary` | Hyuns UI token | Hyuns UI token | Workbench and index page backgrounds |
| Text/primary | `--text-normal` | Hyuns UI token | Hyuns UI token | Main labels and body text |
| Text/secondary | `--text-muted` | Hyuns UI token | Hyuns UI token | Descriptions and supporting copy |
| Border/default | `--border` | Hyuns UI token | Hyuns UI token | Controls and surface outlines |
| Accent/primary | `--accent` | Hyuns UI token | Hyuns UI token | Active controls, focus, and selected state |

### Rules

- Prefer `@hyunsdev/ui` semantic classes and CSS variables over raw colors.
- Use accent only for interactive state, not decoration.
- Dot-grid backgrounds are allowed on playground index surfaces.

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

- **Structure**: `PlaygroundIndexPage` from `@hyunsdev/playground-ui/PlaygroundRoute` wraps grouped `PlaygroundRouteIndex` items.
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
