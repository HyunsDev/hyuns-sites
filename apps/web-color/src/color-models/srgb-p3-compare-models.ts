import { clampGamut, converter, formatHex, formatRgb, parse, toGamut } from "culori"
import type { Color } from "culori"

import { formatCssColor } from "./color-css-format.ts"
import { isColorInGamut } from "./color-gamut-analysis.ts"

export type SrgbP3CompareParseResult =
  | {
      readonly color: Color
      readonly status: "parsed"
    }
  | {
      readonly status: "invalid"
    }

export type SrgbP3CompareStatus = "p3-only" | "srgb" | "out-of-p3"

export type SrgbP3CodeRow = {
  readonly id: string
  readonly label: string
  readonly value: string
}

export type SrgbP3ConversionSwatch = {
  readonly color: string
  readonly css: string
  readonly id: "original" | "srgb-clipped" | "srgb-mapped"
  readonly label: string
}

export type SrgbP3CompareResult = {
  readonly displayP3Rows: readonly SrgbP3CodeRow[]
  readonly inDisplayP3: boolean
  readonly inSrgb: boolean
  readonly srgbPreviewHex: string
  readonly srgbRows: readonly SrgbP3CodeRow[]
  readonly status: SrgbP3CompareStatus
  readonly statusLabel: string
  readonly swatches: readonly SrgbP3ConversionSwatch[]
}

export const SRGB_P3_COMPARE_PRESETS = [
  "#ff5a3d",
  "#325bff",
  "oklch(70% 0.18 32)",
  "color(display-p3 1 0 0)",
  "color(display-p3 0 0.85 0.35)",
] as const

const toRgb = converter("rgb")
const toSrgbGamut = toGamut("rgb", "oklch")

export function parseSrgbP3CompareInput(
  input: string
): SrgbP3CompareParseResult {
  const color = parse(input.trim())

  return color ? { color, status: "parsed" } : { status: "invalid" }
}

export function createSrgbP3CompareResult(
  color: Color
): SrgbP3CompareResult {
  const inSrgb = isColorInGamut(color, "rgb")
  const inDisplayP3 = isColorInGamut(color, "p3")
  const srgbClippedColor = clampGamut("rgb")(color) ?? toRgb(color)
  const srgbMappedColor = toSrgbGamut(color)
  const status = getCompareStatus(inSrgb, inDisplayP3)

  return {
    displayP3Rows: createDisplayP3Rows(color, srgbMappedColor),
    inDisplayP3,
    inSrgb,
    srgbPreviewHex: formatHex(srgbMappedColor),
    srgbRows: createSrgbRows(srgbMappedColor),
    status,
    statusLabel: getCompareStatusLabel(status),
    swatches: [
      {
        color: formatCssColor(color, "displayP3"),
        css: formatCssColor(color, "displayP3"),
        id: "original",
        label: "Original",
      },
      {
        color: formatHex(srgbClippedColor),
        css: formatSrgbColor(srgbClippedColor),
        id: "srgb-clipped",
        label: "sRGB clipped",
      },
      {
        color: formatHex(srgbMappedColor),
        css: formatSrgbColor(srgbMappedColor),
        id: "srgb-mapped",
        label: "sRGB gamut mapped",
      },
    ],
  }
}

function createSrgbRows(color: Color): readonly SrgbP3CodeRow[] {
  return [
    { id: "hex", label: "Hex", value: formatHex(color) },
    { id: "rgb", label: "RGB", value: formatRgb(color) },
    { id: "oklch", label: "OKLCH", value: formatCssColor(color, "oklch") },
    { id: "color-srgb", label: "CSS color()", value: formatSrgbColor(color) },
  ]
}

function createDisplayP3Rows(
  color: Color,
  srgbFallbackColor: Color
): readonly SrgbP3CodeRow[] {
  return [
    {
      id: "display-p3",
      label: "Display P3",
      value: formatCssColor(color, "displayP3"),
    },
    { id: "oklch", label: "OKLCH", value: formatCssColor(color, "oklch") },
    {
      id: "rgb-fallback",
      label: "RGB fallback",
      value: formatRgb(srgbFallbackColor),
    },
  ]
}

function getCompareStatus(
  inSrgb: boolean,
  inDisplayP3: boolean
): SrgbP3CompareStatus {
  if (inSrgb) {
    return "srgb"
  }

  return inDisplayP3 ? "p3-only" : "out-of-p3"
}

function getCompareStatusLabel(status: SrgbP3CompareStatus) {
  switch (status) {
    case "srgb":
      return "in sRGB"
    case "p3-only":
      return "P3 only"
    case "out-of-p3":
      return "out of Display P3"
    default:
      return assertNeverStatus(status)
  }
}

function formatSrgbColor(color: Color) {
  const rgb = toRgb(color)

  return `color(srgb ${formatNumber(rgb.r)} ${formatNumber(rgb.g)} ${formatNumber(rgb.b)})`
}

function formatNumber(value: number) {
  const normalizedValue = Math.abs(value) < 0.0005 ? 0 : value

  return Number.isInteger(normalizedValue)
    ? String(normalizedValue)
    : normalizedValue.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")
}

function assertNeverStatus(status: never): never {
  throw new RangeError(`Unknown sRGB/P3 compare status: ${status}`)
}
