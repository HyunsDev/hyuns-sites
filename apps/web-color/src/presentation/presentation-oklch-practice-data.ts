export type PaletteSwatch = {
  readonly color: string
  readonly css: string
  readonly inSrgb: boolean
  readonly label: string
  readonly lightness: number
}

export type PaletteComparisonRow = {
  readonly id: "hsl" | "oklch"
  readonly label: string
  readonly swatches: readonly PaletteSwatch[]
}

export type PaletteScaleResult = {
  readonly baseColor: string
  readonly status: "invalid" | "parsed"
  readonly swatches: readonly PaletteSwatch[]
}

export type StateColorRow = {
  readonly color: string
  readonly css: string
  readonly id: "active" | "base" | "disabled" | "hover"
  readonly label: string
}

export type StateColorResult = {
  readonly cssExample: string
  readonly rows: readonly StateColorRow[]
  readonly status: "invalid" | "parsed"
}

export type ThemeTokenRow = {
  readonly id: "dark" | "light"
  readonly label: string
  readonly tokens: readonly ThemeToken[]
}

export type ThemeToken = {
  readonly color: string
  readonly lightness: number
  readonly role: "accent" | "background" | "border" | "surface" | "text"
}

export type GradientComparisonRow = {
  readonly id: "hsl" | "oklch" | "rgb"
  readonly label: string
  readonly swatches: readonly GradientSwatch[]
}

export type GradientSwatch = {
  readonly color: string
  readonly inSrgb: boolean
  readonly label: string
}

export type ColorModelDecisionRow = {
  readonly model: "HSL/HSV" | "OKLCH" | "RGB"
  readonly use: string
}

export const DEFAULT_OKLCH_COLOR = "oklch(70% 0.18 32)"

export const PALETTE_STOPS = [
  { label: "50", lightness: 96 },
  { label: "100", lightness: 92 },
  { label: "200", lightness: 86 },
  { label: "300", lightness: 78 },
  { label: "400", lightness: 68 },
  { label: "500", lightness: 58 },
  { label: "600", lightness: 48 },
  { label: "700", lightness: 38 },
  { label: "800", lightness: 28 },
  { label: "900", lightness: 20 },
] as const

export const OKLCH_USE_CASES = [
  "palette",
  "state",
  "dark mode",
] as const satisfies readonly string[]

export const COLOR_MODEL_DECISION_ROWS = [
  { model: "RGB", use: "표시, 저장, 장치 출력" },
  { model: "HSL/HSV", use: "picker, 빠른 색 선택" },
  { model: "OKLCH", use: "팔레트, 상태, 테마 설계" },
] as const satisfies readonly ColorModelDecisionRow[]
