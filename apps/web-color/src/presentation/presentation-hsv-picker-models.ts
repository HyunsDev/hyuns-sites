import { converter } from "culori"

import {
  createDefaultColorCoordinate,
  type ColorCoordinate,
  type HslCoordinate,
  type HsvCoordinate,
} from "../color-models/color-coordinate-utils.ts"
import { parseCssColorInput } from "../color-models/css-color-notation-models.ts"

export type ColorPickerModelId = "hsl" | "hsv"
export type ColorPickerCoordinate = HslCoordinate | HsvCoordinate

const toHsl = converter("hsl")
const toHsv = converter("hsv")

export function createDefaultColorPickerCoordinate(
  modelId: ColorPickerModelId
): ColorPickerCoordinate {
  return requireColorPickerCoordinate(createDefaultColorCoordinate(modelId))
}

export function parseColorPickerColorInput(
  value: string,
  modelId: ColorPickerModelId,
  fallbackHue: number
): ColorPickerCoordinate | null {
  const parsed = parseCssColorInput(value)

  if (parsed.status === "invalid") {
    return null
  }

  if (modelId === "hsl") {
    const hslColor = toHsl(parsed.color)

    if (!hslColor) {
      return null
    }

    return {
      modelId,
      h: normalizeHue(hslColor.h ?? fallbackHue),
      s: clampPercent((hslColor.s ?? 0) * 100),
      l: clampPercent((hslColor.l ?? 0) * 100),
    }
  }

  const hsvColor = toHsv(parsed.color)

  if (!hsvColor) {
    return null
  }

  return {
    modelId,
    h: normalizeHue(hsvColor.h ?? fallbackHue),
    s: clampPercent((hsvColor.s ?? 0) * 100),
    v: clampPercent((hsvColor.v ?? 0) * 100),
  }
}

export function requireColorPickerCoordinate(
  coordinate: ColorCoordinate
): ColorPickerCoordinate {
  if (coordinate.modelId !== "hsl" && coordinate.modelId !== "hsv") {
    throw new RangeError(
      `Expected HSL or HSV coordinate, received ${coordinate.modelId}`
    )
  }

  return coordinate
}

function normalizeHue(value: number) {
  return ((value % 360) + 360) % 360
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value))
}
