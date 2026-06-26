# Image Maker Design System

## 1. Atmosphere & Identity

Image Maker is a quiet production workbench for making reusable icon and banner assets. It should feel precise, dense enough for repeated editing, and visually calm. The signature is a split preview work surface: source and option controls stay compact on the left while icon and banner outputs remain visible together on the right.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --background | Existing Hyuns UI token | Existing Hyuns UI token | App background |
| Surface/panel | --card | Existing Hyuns UI token | Existing Hyuns UI token | Workbench panels |
| Surface/muted | --muted | Existing Hyuns UI token | Existing Hyuns UI token | Preview wells and quiet rows |
| Text/primary | --foreground | Existing Hyuns UI token | Existing Hyuns UI token | Titles and primary labels |
| Text/secondary | --muted-foreground | Existing Hyuns UI token | Existing Hyuns UI token | Helper labels and metadata |
| Border/default | --border | Existing Hyuns UI token | Existing Hyuns UI token | Panel, input, and preview boundaries |
| Accent/primary | --primary | Existing Hyuns UI token | Existing Hyuns UI token | Primary actions and selected states |
| Accent/contrast | --primary-foreground | Existing Hyuns UI token | Existing Hyuns UI token | Text on primary actions |
| Status/success | --status-success | #16A34A | #22C55E | Export success feedback |
| Status/error | --destructive | Existing Hyuns UI token | Existing Hyuns UI token | Export or parse errors |

### Rules

- App chrome uses Hyuns UI semantic tokens instead of product-specific palettes.
- User-generated output colors are data values controlled by the editor, not chrome colors.
- Brand icon defaults may use Simple Icons hex values only inside generated artwork or swatches.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| H1 | 20px / 1.25rem | 600 | 1.3 | 0 | Sidebar product name, major panel titles |
| H2 | 16px / 1rem | 600 | 1.4 | 0 | Panel section titles |
| Body | 14px / 0.875rem | 400 | 1.5 | 0 | Controls and descriptions |
| Body/sm | 13px / 0.8125rem | 400 | 1.45 | 0 | Preview metadata |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0 | Field labels and compact status |
| Code | 12px / 0.75rem | 500 | 1.4 | 0 | Sizes, color values, and file metadata |

### Font Stack

- Primary: Hyuns UI default sans stack.
- Mono: Hyuns UI default mono stack.
- Serif: none.

### Rules

- Workbench text stays compact; no hero-scale type inside panels.
- Field labels are explicit and remain outside inputs.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Tight icon-to-label spacing |
| --space-2 | 8px | Compact rows and toolbar gaps |
| --space-3 | 12px | Field groups |
| --space-4 | 16px | Panel body padding |
| --space-5 | 20px | Preview well padding |
| --space-6 | 24px | Major control sections |

### Grid

- Shell: Hyuns UI Workbench.
- Primary sidebar: WorkbenchPrimarySidebar.
- Main split: left options panel plus right preview panel.
- Preview split: icon preview above banner preview.
- Breakpoints: inherit Tailwind defaults used by the workspace.

### Rules

- Preview surfaces keep stable aspect ratios and never resize from toolbar text.
- Controls wrap on narrow viewports instead of overflowing.

## 5. Components

### Workbench Shell

- **Structure**: `Workbench` with `WorkbenchPrimarySidebar` and `WorkbenchContentArea`.
- **Variants**: source routes for Lucide, Brand, SVG, and PNG.
- **Spacing**: panel padding uses `--space-4`; menu rows use Workbench defaults.
- **States**: active route, hover, focus, disabled.
- **Accessibility**: sidebar links use buttons/anchors with visible labels and tooltips where icon-only.
- **Motion**: only Hyuns UI built-in transitions.

### Preview Panel

- **Structure**: panel header, preview well, action footer.
- **Variants**: icon and banner.
- **Spacing**: preview well uses `--space-5`; actions use `--space-2`.
- **States**: ready, loading, empty, copied, error.
- **Accessibility**: generated images have descriptive alt text; export buttons have explicit labels.
- **Motion**: opacity transitions only.

### Option Field

- **Structure**: label, control, optional compact metadata.
- **Variants**: combobox, input, color picker, slider, file upload, textarea.
- **Spacing**: field groups use `--space-3`.
- **States**: default, focus, disabled, invalid.
- **Accessibility**: every input has a visible label.
- **Motion**: none beyond component defaults.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100-150ms | ease-out | Button press and selected route states |
| Standard | 200ms | ease-in-out | Preview refresh opacity |

### Rules

- Only animate opacity or transform.
- Reduced motion receives the same usable layout without additional animation.
- Export status is text-based, not motion-dependent.

## 7. Depth & Surface

### Strategy

Use Hyuns UI mixed surface treatment: semantic panel borders, muted preview wells, and minimal shadows inherited from Workbench.

| Type | Value | Usage |
|------|-------|-------|
| Default border | `border-border` | Panels, preview wells, upload areas |
| Muted fill | `bg-muted/30` | Preview wells |
| Primary fill | `bg-background` | Generated image stage |

