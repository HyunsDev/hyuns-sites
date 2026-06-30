import { converter, formatHex, parse, toGamut } from "culori"
import type { Oklch } from "culori"

import { formatCssColor } from "../color-models/color-css-format.ts"
import { isColorInGamut } from "../color-models/color-gamut-analysis.ts"
import { createInterpolationRows } from "../color-models/color-interpolation-models.ts"
import {
  COLOR_MODEL_DECISION_ROWS,
  DEFAULT_OKLCH_COLOR,
  HSL_OKLCH_PALETTE_FAMILIES,
  OKLCH_USE_CASES,
  PALETTE_STOPS,
  type GradientComparisonRow,
  type PaletteComparisonGroup,
  type PaletteComparisonRow,
  type PaletteScaleResult,
  type PaletteSwatch,
  type StateColorResult,
  type StateColorRow,
  type ThemeToken,
  type ThemeTokenRow,
} from "./presentation-oklch-practice-data.ts"
import { createOklchScale, createPaletteSwatch } from "./presentation-oklch-scale.ts"

const toOklch = converter("oklch")
const mapToSrgb = toGamut("rgb", "oklch")

export { COLOR_MODEL_DECISION_ROWS, OKLCH_USE_CASES }
export type {
  GradientComparisonRow,
  PaletteComparisonGroup,
  PaletteComparisonRow,
  PaletteScaleResult,
  PaletteSwatch,
  StateColorResult,
  StateColorRow,
  ThemeToken,
  ThemeTokenRow,
}

export function createHslOklchPaletteComparisonRows(): readonly PaletteComparisonRow[] {
  return createHslOklchPaletteComparisonGroups()[0]?.rows ?? []
}

export function createHslOklchPaletteComparisonGroups(): readonly PaletteComparisonGroup[] {
  return HSL_OKLCH_PALETTE_FAMILIES.map((family) => ({
    id: family.id,
    label: family.label,
    rows: createHslOklchPaletteComparisonRowsForFamily(family),
  }))
}

function createHslOklchPaletteComparisonRowsForFamily(
  family: (typeof HSL_OKLCH_PALETTE_FAMILIES)[number]
): readonly PaletteComparisonRow[] {
  return [
    {
      id: "hsl",
      label: "HSL",
      swatches: PALETTE_STOPS.map((stop) =>
        createPaletteSwatch({
          color: {
            mode: "hsl",
            h: family.hslHue,
            s: family.hslSaturation,
            l: stop.lightness / 100,
          },
          cssNotation: "hsl",
          label: stop.label,
          lightness: stop.lightness,
        })
      ),
    },
    {
      id: "oklch",
      label: "OKLCH",
      swatches: createOklchScale({
        chroma: family.oklchChroma,
        hue: family.oklchHue,
      }),
    },
  ]
}

export function createOklchLightnessScale(): readonly PaletteSwatch[] {
  return createOklchScale({
    chroma: 0.1,
    hue: 260,
  })
}

export function createOklchPaletteScale(input: string): PaletteScaleResult {
  const parsed = parseBaseOklch(input)
  const base = parsed ?? parseBaseOklch(DEFAULT_OKLCH_COLOR)

  if (!base) {
    return { baseColor: DEFAULT_OKLCH_COLOR, status: "invalid", swatches: [] }
  }

  return {
    baseColor: formatCssColor(base, "oklch"),
    status: parsed ? "parsed" : "invalid",
    swatches: createOklchScale({
      chroma: clamp(base.c, 0.04, 0.18),
      hue: base.h ?? 32,
    }),
  }
}

export function createStateColorRelations(input: string): StateColorResult {
  const parsed = parseBaseOklch(input)
  const base = parsed ?? parseBaseOklch(DEFAULT_OKLCH_COLOR)

  if (!base) {
    return { cssExample: "", rows: [], status: "invalid" }
  }

  const rows = [
    createStateColorRow("base", "base", base),
    createStateColorRow("hover", "hover", shiftOklch(base, 5, -0.02)),
    createStateColorRow("active", "active", shiftOklch(base, -7, -0.03)),
    createStateColorRow("disabled", "disabled", {
      ...base,
      c: base.c * 0.16,
      l: clamp(base.l * 0.86, 0.32, 0.72),
    }),
  ] as const satisfies readonly StateColorRow[]

  return {
    cssExample: [
      "--button: oklch(70% 0.18 32);",
      "hover: color-mix(in oklch, var(--button) 86%, white);",
      "active: color-mix(in oklch, var(--button) 88%, black);",
    ].join("\n"),
    rows,
    status: parsed ? "parsed" : "invalid",
  }
}

export function createThemeLightnessRows(): readonly ThemeTokenRow[] {
  return [
    {
      id: "light",
      label: "Light",
      tokens: createThemeTokens([
        ["background", 98, 0.01],
        ["surface", 94, 0.012],
        ["border", 82, 0.015],
        ["text", 18, 0.012],
        ["accent", 66, 0.18],
      ]),
    },
    {
      id: "dark",
      label: "Dark",
      tokens: createThemeTokens([
        ["background", 14, 0.012],
        ["surface", 20, 0.014],
        ["border", 32, 0.02],
        ["text", 92, 0.01],
        ["accent", 72, 0.16],
      ]),
    },
  ]
}

export function createGradientComparisonRows(): readonly GradientComparisonRow[] {
  const rows = createInterpolationRows({
    endColor: "oklch(68% 0.16 280)",
    hueStrategyId: "shorter",
    startColor: DEFAULT_OKLCH_COLOR,
    stepCount: 7,
  })

  return rows
    .filter(isGradientRow)
    .map((row) => ({
      id: row.id,
      label: row.label,
      swatches: row.steps.map((step) => ({
        color: step.hex,
        inSrgb: step.inSrgb,
        label: `${Math.round(step.position * 100)}%`,
      })),
    }))
}

function parseBaseOklch(input: string): Oklch | null {
  const parsed = parse(input)

  if (!parsed) {
    return null
  }

  return toOklch(parsed)
}

function createStateColorRow(
  id: StateColorRow["id"],
  label: string,
  color: Oklch
): StateColorRow {
  const displayColor = isColorInGamut(color, "rgb") ? color : mapToSrgb(color)

  return {
    color: formatHex(displayColor),
    css: formatCssColor(color, "oklch"),
    id,
    label,
  }
}

function shiftOklch(color: Oklch, lightnessDelta: number, chromaDelta: number) {
  return {
    ...color,
    c: clamp(color.c + chromaDelta, 0, 0.4),
    l: clamp(color.l + lightnessDelta / 100, 0, 1),
  }
}

function createThemeTokens(
  tokens: readonly (readonly [ThemeToken["role"], number, number])[]
): readonly ThemeToken[] {
  return tokens.map(([role, lightness, chroma]) => {
    const color = {
      mode: "oklch",
      c: chroma,
      h: 32,
      l: lightness / 100,
    } satisfies Oklch

    return {
      color: formatHex(isColorInGamut(color, "rgb") ? color : mapToSrgb(color)),
      lightness,
      role,
    }
  })
}

function isGradientRow(
  row: ReturnType<typeof createInterpolationRows>[number]
): row is ReturnType<typeof createInterpolationRows>[number] & {
  readonly id: "hsl" | "oklch" | "rgb"
} {
  return row.id === "rgb" || row.id === "hsl" || row.id === "oklch"
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
