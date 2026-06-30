import { converter } from "culori"
import type { Color } from "culori"

import { formatCssColor } from "./color-css-format.ts"
import type { ColorSpaceModelId } from "./color-space-models.ts"
import type {
  ColorCoordinate,
  ColorCoordinateModelId,
} from "./color-coordinate-utils.ts"
import { toCuloriColor } from "./color-coordinate-utils.ts"
import { parseCssColorInput } from "./css-color-notation-models.ts"

export type SolidTargetCoordinateResult =
  | {
      readonly status: "empty"
    }
  | {
      readonly status: "invalid"
    }
  | {
      readonly status: "partial"
    }
  | {
      readonly status: "unsupported"
    }
  | {
      readonly coordinate: ColorCoordinate
      readonly modelId: ColorCoordinateModelId
      readonly status: "ready"
    }

const toRgb = converter("rgb")
const toHsl = converter("hsl")
const toHsv = converter("hsv")
const toLab = converter("lab")
const toLch = converter("lch")
const toOklab = converter("oklab")
const toOklch = converter("oklch")

export function createSolidTargetCoordinate({
  modelId,
  value,
}: {
  readonly modelId: ColorSpaceModelId
  readonly value: string
}): SolidTargetCoordinateResult {
  if (value.trim().length === 0) {
    return { status: "empty" }
  }

  const controlModelId = getSolidTargetCoordinateModelId(modelId)

  if (!controlModelId) {
    return { status: "unsupported" }
  }

  const parseResult = parseCssColorInput(value)

  if (parseResult.status === "invalid") {
    return { status: "invalid" }
  }

  const coordinate = createTargetCoordinate(controlModelId, parseResult.color)

  return coordinate
    ? { status: "ready", modelId: controlModelId, coordinate }
    : { status: "partial" }
}

export function formatSolidTargetCoordinate(coordinate: ColorCoordinate) {
  const color = toCuloriColor(coordinate)

  switch (coordinate.modelId) {
    case "rgb":
      return formatCssColor(color, "rgb")
    case "hsl":
      return formatCssColor(color, "hsl")
    case "hsv":
      return formatCssColor(color, "rgb")
    case "lab":
      return formatCssColor(color, "lab")
    case "lch":
      return formatCssColor(color, "lch")
    case "oklab":
      return formatCssColor(color, "oklab")
    case "oklch":
      return formatCssColor(color, "oklch")
    default:
      return assertNeverCoordinate(coordinate)
  }
}

export function getSolidTargetCoordinateModelId(
  modelId: ColorSpaceModelId
): ColorCoordinateModelId | null {
  switch (modelId) {
    case "rgb":
      return "rgb"
    case "hsl":
    case "hsl-cube":
      return "hsl"
    case "hsv":
    case "hsv-cube":
      return "hsv"
    case "lab":
      return "lab"
    case "lch":
    case "lch-cube":
      return "lch"
    case "oklab":
      return "oklab"
    case "oklch":
    case "oklch-cube":
      return "oklch"
    case "hwb":
    case "hwb-cube":
    case "xyz":
    case "xyy":
      return null
    default:
      return assertNeverModel(modelId)
  }
}

function createTargetCoordinate(
  modelId: ColorCoordinateModelId,
  color: Color
): ColorCoordinate | null {
  switch (modelId) {
    case "rgb":
      return createRgbCoordinate(color)
    case "hsl":
      return createHslCoordinate(color)
    case "hsv":
      return createHsvCoordinate(color)
    case "lab":
      return createLabCoordinate(color)
    case "lch":
      return createLchCoordinate(color)
    case "oklab":
      return createOklabCoordinate(color)
    case "oklch":
      return createOklchCoordinate(color)
    default:
      return assertNeverCoordinateModel(modelId)
  }
}

function createRgbCoordinate(color: Color): ColorCoordinate | null {
  const rgb = toRgb(color)
  const r = readFinite(rgb.r)
  const g = readFinite(rgb.g)
  const b = readFinite(rgb.b)

  return r === null || g === null || b === null
    ? null
    : { modelId: "rgb", r: r * 255, g: g * 255, b: b * 255 }
}

function createHslCoordinate(color: Color): ColorCoordinate | null {
  const hsl = toHsl(color)
  const s = readFinite(hsl.s)
  const l = readFinite(hsl.l)

  return s === null || l === null
    ? null
    : { modelId: "hsl", h: normalizeHue(hsl.h), s: s * 100, l: l * 100 }
}

function createHsvCoordinate(color: Color): ColorCoordinate | null {
  const hsv = toHsv(color)
  const s = readFinite(hsv.s)
  const v = readFinite(hsv.v)

  return s === null || v === null
    ? null
    : { modelId: "hsv", h: normalizeHue(hsv.h), s: s * 100, v: v * 100 }
}

function createLabCoordinate(color: Color): ColorCoordinate | null {
  const lab = toLab(color)
  const l = readFinite(lab.l)
  const a = readFinite(lab.a)
  const b = readFinite(lab.b)

  return l === null || a === null || b === null
    ? null
    : { modelId: "lab", l, a, b }
}

function createLchCoordinate(color: Color): ColorCoordinate | null {
  const lch = toLch(color)
  const l = readFinite(lch.l)
  const c = readFinite(lch.c)

  return l === null || c === null
    ? null
    : { modelId: "lch", l, c, h: normalizeHue(lch.h) }
}

function createOklabCoordinate(color: Color): ColorCoordinate | null {
  const oklab = toOklab(color)
  const l = readFinite(oklab.l)
  const a = readFinite(oklab.a)
  const b = readFinite(oklab.b)

  return l === null || a === null || b === null
    ? null
    : { modelId: "oklab", l: l * 100, a, b }
}

function createOklchCoordinate(color: Color): ColorCoordinate | null {
  const oklch = toOklch(color)
  const l = readFinite(oklch.l)
  const c = readFinite(oklch.c)

  return l === null || c === null
    ? null
    : { modelId: "oklch", l: l * 100, c, h: normalizeHue(oklch.h) }
}

function normalizeHue(value: number | undefined) {
  return value === undefined || !Number.isFinite(value)
    ? 0
    : ((value % 360) + 360) % 360
}

function readFinite(value: number | undefined) {
  return value === undefined || !Number.isFinite(value) ? null : value
}

function assertNeverModel(modelId: never): never {
  throw new RangeError(`Unknown solid target model: ${modelId}`)
}

function assertNeverCoordinateModel(modelId: never): never {
  throw new RangeError(`Unknown solid target coordinate model: ${modelId}`)
}

function assertNeverCoordinate(coordinate: never): never {
  throw new RangeError(`Unknown solid target coordinate: ${coordinate}`)
}
