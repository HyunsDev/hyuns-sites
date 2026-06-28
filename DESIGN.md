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
| Body | 16px / 1rem | 400 | 1.5 | 0 | Default app text |
| Body/sm | 14px / 0.875rem | 400-500 | 1.5 | 0 | Compact descriptions and controls |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0 | Dense labels and metadata |
| Micro | 10.4-11px / 0.65-0.6875rem | 500 | 1.2 | 0 | Canvas statistics chips |

### Font Stack

- Primary: Hyuns UI `font-sans` stack.
- Mono: Hyuns UI mono stack through Tailwind `font-mono`.

### Rules

- Tool panels use compact type because the visualization is the primary object.
- Do not use negative letter spacing.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight label and chip spacing |
| `--space-2` | 8px | Compact control gaps |
| `--space-3` | 12px | Overlay padding |
| `--space-4` | 16px | Stage padding on wider screens |
| `--space-6` | 24px | Large intra-panel separation |

### Grid

- Web Color stages use a full-viewport canvas with absolute overlay slots.
- Mobile controls use bottom-centered panels; desktop controls may pin to start/end slots.
- Breakpoints follow Tailwind defaults.

### Rules

- Keep fixed-format controls dimensionally stable with explicit grid tracks or icon button sizes.
- Avoid nested cards; use panels only for real tools and overlays.

## 5. Components

### Floating Tool Panel

- **Structure**: semantic `section` or grouped controls over `PlaygroundStage`.
- **Variants**: bottom settings panel, compact icon toolbar, canvas metadata chips.
- **Spacing**: 8-12px internal gaps, 12px panel padding.
- **States**: hover, focus, active, disabled states come from Hyuns UI components.
- **Accessibility**: icon-only controls require `aria-label`; shortcut hints belong in tooltips.
- **Motion**: panel and control motion should be micro-duration and opacity/transform only.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100-150ms | ease-out | Button and switch state changes |
| Standard | 200-300ms | ease-in-out | Panel appearance and route-level transitions |

### Rules

- Canvas motion may run continuously when it explains the model, but must offer a pause control.
- Keyboard shortcuts must avoid hijacking focused buttons, inputs, sliders, switches, and editable content.
- Respect established shortcuts shown in the UI.

## 7. Depth & Surface

### Strategy

Mixed, with restrained borders and subtle shadows from Hyuns UI tokens.

| Level | Treatment | Usage |
|-------|-----------|-------|
| Canvas | Borderless or subtle token background | Primary visualization surface |
| Panel | Token border, translucent primary background, backdrop blur | Floating settings and toolbars |
| Chip | Token border, translucent primary background | Canvas metadata |
